import { ContentCopy } from "@mui/icons-material";
import toast from "react-hot-toast";
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

import "../styles/ShareDrawer.css";

type ShareDrawerProps = {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
};

export const ShareDrawer = ({ open, onClose, shareUrl }: ShareDrawerProps) => {
  return (
    <SwipeableDrawer
      className="ShareDrawer"
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
          backgroundColor: "var(--card-bg)",
          color: "var(--main-text)",
        },
      }}
    >
      <Box role="presentation" onClick={onClose} onKeyDown={onClose}>
        <Typography className="ShareDrawer__title">Share</Typography>
        <List>
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <ListItem className="ShareDrawer__listItem">
              <ListItemButton
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`
                  );
                  toast.success("Copied to clipboard");
                }}
              >
                <ListItemIcon>
                  <Box padding="8px">
                    <ContentCopy className="ShareDrawer__copyIcon" />
                  </Box>
                </ListItemIcon>
                <ListItemText>Copy link</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem className="ShareDrawer__listItem">
              <TelegramShareButton
                url={`https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`}
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
            <ListItem className="ShareDrawer__listItem">
              <WhatsappShareButton
                url={`https://reverbeprintemps.github.io${process.env.PUBLIC_URL}${shareUrl}`}
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
