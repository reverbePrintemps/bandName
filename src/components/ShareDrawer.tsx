import {
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import toast from "react-hot-toast";

type ShareDrawerProps = {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
};

export const ShareDrawer = ({ open, onClose, shareUrl }: ShareDrawerProps) => {
  return (
    <SwipeableDrawer
      anchor={"bottom"}
      open={open}
      // TODO Not sure what this is useful for
      onOpen={() => {}}
      onClose={onClose}
      PaperProps={{
        style: {
          maxWidth: "calc(var(--container-max-width) - 32px)",
          margin: "auto",
          borderRadius: "8px",
        },
      }}
    >
      <Box role="presentation" onClick={onClose} onKeyDown={onClose}>
        <Typography padding="24px 24px 8px 24px" variant="h5">
          Share
        </Typography>
        <List>
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <ListItem
              style={{
                padding: "0",
              }}
            >
              <ListItemButton
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`
                  );
                  toast.success("Copied to clipboard");
                }}
                style={{ width: "100%" }}
              >
                <ListItemIcon>
                  <Box padding="8px">
                    <ContentCopy />
                  </Box>
                </ListItemIcon>
                <ListItemText>Copy link</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem
              style={{
                padding: "0",
              }}
            >
              <TelegramShareButton
                url={`https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`}
                style={{ width: "100%" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Box padding="8px">
                      <TelegramIcon size="32px" round />
                    </Box>
                  </ListItemIcon>
                  <ListItemText>Telegram</ListItemText>
                </ListItemButton>
              </TelegramShareButton>
            </ListItem>
            <ListItem
              style={{
                padding: "0",
              }}
            >
              <WhatsappShareButton
                url={`https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`}
                style={{ width: "100%" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Box padding="8px">
                      <WhatsappIcon size="32px" round />
                    </Box>
                  </ListItemIcon>
                  <ListItemText>WhatsApp</ListItemText>
                </ListItemButton>
              </WhatsappShareButton>
            </ListItem>
          </Box>
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
