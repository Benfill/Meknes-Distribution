import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Spinner } from 'flowbite-react';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

export default function ConfirmAlert({ loading, open, handleClose, confirm, cancel, msg }) {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >

                <DialogContent>
                    <DialogContentText>
                        {msg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {loading ? (
                        <>
                            <Button  disabled onClick={cancel}>Annuler</Button>
                            <Button disabled>Loading... <Spinner className='w-4 ml-2 flex justify-end items-center' disabled={false} /> </Button>
                        </>
                    ) : (
                        <>
                            <Button autoFocus onClick={cancel}>Annuler</Button>
                            <Button onClick={confirm}>Confirmer</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
