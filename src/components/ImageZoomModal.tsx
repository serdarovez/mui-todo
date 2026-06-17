import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LazyImage } from "./LazyImage";

type Props = {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
};

export function ImageZoomModal({ open, src, alt, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <IconButton
          aria-label="Close image"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          <CloseIcon />
        </IconButton>
        {src ? (
          <LazyImage
            src={src}
            alt={alt}
            eager
            skeletonRadius={0}
            sx={{
              width: "min(90vw, 800px)",
              height: "85vh",
            }}
          />
        ) : (
          <Box sx={{ p: 4 }}>
            <Typography color="text.secondary">No image available</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
