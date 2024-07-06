import { useEffect, useState } from 'react';
import GET from '../../utils/GET';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import POST from '../../utils/POST';
import { toast } from 'react-toastify';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmAlert from '../../components/Alerts/ConfirmAlert';
import { ListItemIcon } from '@mui/material';

export const Mails = () => {
  const [clients, setClients] = useState([]);
  const [mails, setMails] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [clientsIds, setClientsIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  let mls = sessionStorage.getItem('mails');
  useEffect(() => {
    get_mails();
    get_clients();
  }, [mls]);

  const get_clients = async () => {
    const r = await GET('clients');
    setClients(
      r.clients.map(client => ({
        title: `${client.first_name} ${client.last_name} - ${client.email} - ${client.phone}`,
        id: client.id
      }))
    );
  };

  const get_mails = async () => {
    const r = await GET('mails');
    setMails(r.mails);
  };

  const handleSendMail = async () => {
    setLoading(true);
    const payload = {
      title,
      body,
      client_ids: clientsIds,
    };

    const r = await POST('mails', payload);

    if (r.status === 'success') {
      toast.success(r.message);
      setLoading(false);
      setOpen(false);
    } else if (r.errors) {
      if (r.error.client_ids) toast.error(r.error.client_ids[0]);
      if (r.error.title) toast.error(r.error.title[0]);
      if (r.error.body) toast.error(r.error.body[0]);
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const allMailIds = mails.map(mail => mail.id);
    if (selectAll) {
      setSelectedMailIds([]);
    } else {
      setSelectedMailIds(allMailIds);
    }
    setSelectAll(!selectAll);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMailDelete = (mailId) => {
    const selectedIndex = selectedMailIds.indexOf(mailId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMailIds, mailId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMailIds.slice(1));
    } else if (selectedIndex === selectedMailIds.length - 1) {
      newSelected = newSelected.concat(selectedMailIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMailIds.slice(0, selectedIndex),
        selectedMailIds.slice(selectedIndex + 1),
      );
    }

    setSelectedMailIds(newSelected);
  };

  const handleDeleteSelected = () => {
    setDeleteOpen(true);
  };

  const submitDelete = async () => {
    try {
      setDeleteLoading(true);
      const r = await POST(`mails/delete`, { email_ids: selectedMailIds });
      if (r.status === 'success') {
        toast.success('Mails deleted successfully');
        sessionStorage.removeItem('mails');
        const rs = await GET('mails');
        setMails(rs.mails);
        setSelectedMailIds([]);
        setSelectAll(false);
      } else if (r.errors) {
        toast.error('Failed to delete mails');
      }
    } catch (error) {
      console.error('Error deleting mails:', error);
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className='ml-14'>
      <ConfirmAlert
        msg="Etes-vous sûr de vouloir supprimer ces e-mails ?"
        loading={deleteLoading}
        open={deleteOpen}
        handleClose={() => !deleteLoading ? setDeleteOpen(false) : setDeleteOpen(true)}
        confirm={submitDelete}
        cancel={() => setDeleteOpen(false)}
      />
      <p className='text-center mt-2'>Section des e-mails</p>
      <div className='flex justify-between mx-4 mb-4'>
        <Button variant="contained" color="inherit" onClick={handleClickOpen}>
          <MailIcon color='action' className='mr-2' />
          Envoyer un E-mail aux Clients
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteSelected}
          disabled={selectedMailIds.length === 0}
        >
          Supprimer sélection
        </Button>
      </div>
      <Box className='flex justify-center'>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Ce sont tous les e-mails qui ont été envoyés aux clients
            </Typography>
            <div>
              <List dense={true}>
                <ListItem
                  button
                  onClick={handleSelectAll}
                >
                  <Checkbox
                    edge="start"
                    checked={selectAll}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary="Sélectionner tout" />
                </ListItem>
                {mails.map((mail) => (
                  <ListItem
                    key={mail.id}
                    button
                    onClick={() => handleMailDelete(mail.id)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedMailIds.includes(mail.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar>
                        <MailIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${mail.title}, envoyé à "${mail.client.first_name} ${mail.client.last_name}"`}
                      secondary={mail.body}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          </Grid>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Envoyer un E-mail</DialogTitle>
        <DialogContent>
          <div className='w-[500px]'>
            <TextField
              required
              id="outlined-required"
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ marginBottom: 2, width: '100%' }}
            />
            <TextField
              id="outlined-multiline-static"
              label="Corps"
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ marginBottom: 2, width: '100%' }}
            />
          </div>
          <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={clients}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              onChange={(event, value) => setClientsIds(value.map(client => client.id))}
              value={clients.filter(client => clientsIds.includes(client.id))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Clients"
                  placeholder="Sélectionner des clients"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSelectAll}
                            sx={{ marginLeft: 1 }}
                          >
                            Sélectionner tout
                          </Button>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          {loading ? (
            <Button disabled color="primary">
              Chargement...
            </Button>
          ) : (
            <Button onClick={handleSendMail} color="primary">
              Envoyer l'E-mail
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
