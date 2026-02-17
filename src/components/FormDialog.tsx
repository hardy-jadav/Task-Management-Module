import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ReactNode } from 'react';

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSubmit: () => void;
    submitLabel?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function FormDialog({
    open,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = 'Save',
    maxWidth = 'sm',
}: FormDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} variant="contained">{submitLabel}</Button>
            </DialogActions>
        </Dialog>
    );
}
