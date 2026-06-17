import { useEffect, useRef, useState } from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import { alpha, useTheme, keyframes } from "@mui/material/styles";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

type Props = Omit<BoxProps<"img">, "src" | "component"> & {
  src: string;
  alt: string;
  eager?: boolean;
  skeletonRadius?: number | string;
};

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export function LazyImage({
  src,
  alt,
  eager = false,
  skeletonRadius = 6,
  sx,
  onClick,
  ...rest
}: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager, inView]);

  const baseColor = isDark
    ? alpha(theme.palette.primary.main, 0.12)
    : alpha(theme.palette.primary.main, 0.08);
  const highlightColor = isDark
    ? alpha(theme.palette.primary.main, 0.28)
    : alpha(theme.palette.primary.main, 0.22);

  return (
    <Box
      ref={containerRef}
      onClick={onClick}
      sx={{
        position: "relative",
        display: "inline-flex",
        overflow: "hidden",
        ...sx,
      }}
    >
      {(!loaded || errored) && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: skeletonRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: alpha(theme.palette.primary.main, isDark ? 0.45 : 0.35),
            background: `linear-gradient(110deg, ${baseColor} 30%, ${highlightColor} 50%, ${baseColor} 70%)`,
            backgroundSize: "200% 100%",
            animation: errored ? "none" : `${shimmer} 1.6s linear infinite`,
            border: `1px solid ${alpha(
              theme.palette.primary.main,
              isDark ? 0.18 : 0.12,
            )}`,
          }}
        >
          {errored ? (
            <BrokenImageIcon sx={{ fontSize: 28, opacity: 0.6 }} />
          ) : (
            <MenuBookIcon sx={{ fontSize: 28, opacity: 0.7 }} />
          )}
        </Box>
      )}
      {inView && !errored && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            setLoaded(true);
          }}
          {...rest}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1)" : "scale(0.98)",
            transition:
              "opacity 360ms ease, transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            display: "block",
          }}
        />
      )}
    </Box>
  );
}
