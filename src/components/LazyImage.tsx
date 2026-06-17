import { useEffect, useRef, useState } from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

type Props = Omit<BoxProps<"img">, "src" | "component"> & {
  src: string;
  alt: string;
  eager?: boolean;
  skeletonRadius?: number | string;
};

export function LazyImage({
  src,
  alt,
  eager = false,
  skeletonRadius = 6,
  sx,
  onClick,
  ...rest
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

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

  return (
    <Box
      ref={containerRef}
      onClick={onClick}
      sx={{
        position: "relative",
        display: "inline-flex",
        ...sx,
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: skeletonRadius,
          }}
        />
      )}
      {inView && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          {...rest}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: loaded ? 1 : 0,
            transition: "opacity 280ms ease",
            display: "block",
          }}
        />
      )}
    </Box>
  );
}
