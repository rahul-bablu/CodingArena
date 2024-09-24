import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Zoom,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom style={{ transitionDelay: '100ms' }} ref={ref} {...props} />;
});

function ConfirmDialog({
  title,
  content,
  open,
  setOpen,
  action
}: {
  title: string;
  content: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: any;
}) {
  // const theme = useTheme();
  return (
    <Dialog
      onClose={() => { setOpen(false); action(false) }}
      TransitionComponent={Transition}
      open={open}
      disableEscapeKeyDown={true}
    >
      <DialogTitle>
        {" "}
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">
          {content}
        </Typography>
        <Typography variant="subtitle2">
          You can't undo this operation
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="info" onClick={() => { action(false); setOpen(false); }}>No</Button>
        <Button variant="contained" color="error" onClick={() => { action(true); setOpen(false); }}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;