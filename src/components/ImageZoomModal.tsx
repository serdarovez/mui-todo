import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

type Props = {
  open: boolean;
  thumb: string | null;
  large: string | null;
  alt: string;
  onClose: () => void;
};

export function ImageZoomModal({ open, thumb, large, alt, onClose }: Props) {
  const [hiResReady, setHiResReady] = useState(false);
  const [thumbReady, setThumbReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setHiResReady(false);
      setThumbReady(false);
      return;
    }
    if (!large) {
      setHiResReady(false);
      return;
    }
    const img = new Image();
    img.src = large;
    if (img.complete && img.naturalWidth > 0) {
      setHiResReady(true);
      return;
    }
    const onLoad = () => setHiResReady(true);
    const onError = () => setHiResReady(false);
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [open, large]);

  const displaySrc = hiResReady && large ? large : (thumb ?? large);
  const showHiResProgress = !!displaySrc && !hiResReady && !!large;
  const showInitialSpinner = !displaySrc || (displaySrc === thumb && !thumbReady);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        {alt || "Cover preview"}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Fade in={showHiResProgress} unmountOnExit>
        <LinearProgress
          sx={{ height: 2 }}
          aria-label="Loading high resolution image"
        />
      </Fade>

      <DialogContent
        dividers
        sx={{
          p: 0,
          position: "relative",
          minHeight: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
        }}
      >
        {displaySrc ? (
          <>
            <Box
              component="img"
              src={displaySrc}
              alt={alt}
              onLoad={() => {
                if (displaySrc === thumb) setThumbReady(true);
              }}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: hiResReady ? "none" : "blur(4px)",
                transition: "filter 320ms ease",
                opacity: showInitialSpinner ? 0 : 1,
              }}
            />
            {showInitialSpinner && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  color: "text.secondary",
                }}
              >
                <CircularProgress size={28} />
                <Typography variant="caption">Loading image…</Typography>
              </Box>
            )}
          </>
        ) : (
          <Typography sx={{ p: 4 }} color="text.secondary">
            No image available
          </Typography>
        )}
      </DialogContent>

      <Fade in={showHiResProgress} unmountOnExit timeout={250}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            color: "text.secondary",
            display: "block",
          }}
        >
          Loading full resolution…
        </Typography>
      </Fade>
    </Dialog>
  );
}
