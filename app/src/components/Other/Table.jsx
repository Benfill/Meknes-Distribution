import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  TextField,
  Input,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GET from '../../utils/GET';
import POST from '../../utils/POST';
import PUT from '../../utils/PUT';
import DELETE_API from '../../utils/DELETE';
import ConfirmAlert from '../Alerts/ConfirmAlert';
import { Spinner } from 'flowbite-react';
import SubSelect from '../Client-File/SubSelect';

const Table = ({ columns, data, entityType, validateEntity, updatedData, suppliers = [] }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [alertLoad, setAlertLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const ENDPOINT = entityType.toLowerCase() === 'category' ? 'categories' : `${entityType.toLowerCase()}s`;

  const queryClient = useQueryClient();
  const memoizedColumns = useMemo(() => {
    return columns.map((col) => {
      let muiEditTextFieldProps = undefined;
  
      if (col.required) {
        muiEditTextFieldProps = {
          required: true,
          error: !!validationErrors[col.accessorKey],
          helperText: validationErrors[col.accessorKey],
          onFocus: () =>
            setValidationErrors((prev) => ({
              ...prev,
              [col.accessorKey]: undefined,
            })),
        };
      } else if (col.accessorKey === 'type') {
        muiEditTextFieldProps = {
          select: true,
          SelectProps: {
            displayEmpty: true,
            renderValue: (value) => (value ? value : 'Select Type'),
          },
          children: [
            <MenuItem key="Particulier" value="Particulier">Particulier</MenuItem>,
            <MenuItem key="Entreprise" value="Entreprise">Entreprise</MenuItem>,
          ],
        };
      } else if (col.accessorKey === 'role') {
        muiEditTextFieldProps = {
          select: true,
          SelectProps: {
            displayEmpty: true,
            renderValue: (value) => (value ? value : 'Select Role'),
          },
          children: col.selectOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
        };
      } else if (col.accessorKey === 'supplier_id') {
        muiEditTextFieldProps = {
          select: true,
          SelectProps: {
            displayEmpty: true,
            renderValue: (value) => (value ? value.name : 'Select Supplier'),
          },
          children: suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </MenuItem>
          )),
        };
      } else if (col.accessorKey === 'sub_category_id') {
        muiEditTextFieldProps = {
          children: <SubSelect />,
        };
      } else if (col.accessorKey === 'image') {
        muiEditTextFieldProps = {
          children: (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, table)}
            />
          ),
        };
      
      } 
  
      return {
        ...col,
        muiEditTextFieldProps,
      };
    });
  }, [columns, validationErrors, suppliers]);
  
  const queryKey = `${entityType.toLowerCase()}s`;

  const createEntity = useMutation({
    mutationFn: async (values) => await POST(ENDPOINT, values),
    onSuccess: async () => {
      queryClient.invalidateQueries(queryKey);
      toast.success('Item created successfully');
      setLoading(true);
      updatedData(JSON.parse(sessionStorage.getItem(ENDPOINT)));
      setLoading(false);
    },
  });

  const updateEntity = useMutation({
    mutationFn: async (values) => await PUT(ENDPOINT, values.id, values),
    onSuccess: async () => {
      queryClient.invalidateQueries(ENDPOINT);
      toast.success('Item updated successfully');
    },
  });

  const deleteEntity = useMutation({
    mutationFn: async (id) => await DELETE_API(ENDPOINT, id),
    onSuccess: async () => {
      queryClient.invalidateQueries(ENDPOINT);
      toast.success('Item deleted successfully');
    },
  });

  const handleCreateEntity = async ({ values, table }) => {
    await createEntity.mutateAsync(values);
    table.setCreatingRow(null);
  };

  const handleSaveEntity = async ({ values, table }) => {
    console.log('update click');
    await updateEntity.mutateAsync(values);
    console.log('update after request');
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    setCurrentRow(row);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    setAlertLoad(true);
    if (currentRow) {
      await deleteEntity.mutateAsync(currentRow.original.id);
    }
    setAlertLoad(false);
    setDeleteAlertOpen(false);
    setCurrentRow(null);

    setLoading(true);
    updatedData(JSON.parse(sessionStorage.getItem(ENDPOINT)));
    setLoading(false);
  };

  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateEntity,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveEntity,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Create New {entityType}</DialogTitle>
        <DialogContent>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit {entityType}</DialogTitle>
        <DialogContent>{internalEditComponents}</DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {loading && <Spinner />}
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Create New {entityType}
      </Button>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ConfirmAlert
        loading={alertLoad}
        msg="Do you want to delete this item?"
        open={deleteAlertOpen}
        handleClose={() => setDeleteAlertOpen(false)}
        cancel={() => {
          setDeleteAlertOpen(false);
          setCurrentRow(null);
        }}
        confirm={confirmDelete}
      />
      <ToastContainer />
    </>
  );
};

export default Table;
