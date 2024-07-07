import { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  MenuItem,
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

  const ENDPOINT =
    entityType.toLowerCase() === "category"
      ? "categories"
      : `${entityType.toLowerCase()}s`;

  const queryClient = useQueryClient();

  const { subCategoryOptions, loading: subCategoriesLoading } = useSubSelect();

  const memoizedColumns = useMemo(() => {
    return columns.map((col) => {
      let muiEditTextFieldProps = undefined;

      const today = new Date().toISOString().split("T")[0];

      switch (col.DataTypeNeeded) {
        case "number":
          muiEditTextFieldProps = {
            type: "number",
            inputProps: { min: 0 },
          };
          break;

        case "image":
          muiEditTextFieldProps = {
            type: "file",
            accept: "image/*",
          };
          break;

        case "date":
          muiEditTextFieldProps = {
            type: "date",
            InputLabelProps: {
              shrink: true,
            },
            style: {
              width: "100%",
            },
          };
          break;

        case "float":
          muiEditTextFieldProps = {
            type: "number",
            step: "0.01",
          };
          break;

        default:
          break;
      }

      switch (col.accessorKey) {
        case "required":
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
          break;

        case "type":
          muiEditTextFieldProps = {
            select: true,
            SelectProps: {
              displayEmpty: true,
              renderValue: (value) => (value ? value : "Select Type"),
            },
            children: [
              <MenuItem key="Particulier" value="Particulier">
                Particulier
              </MenuItem>,
              <MenuItem key="Entreprise" value="Entreprise">
                Entreprise
              </MenuItem>,
            ],
          };
          break;

        case "sub_category_id":
          muiEditTextFieldProps = {
            select: true,
            children: subCategoriesLoading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              subCategoryOptions.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ),
          };
          break;

        default:
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
          }
          break;
      }

      return {
        ...col,
        muiEditTextFieldProps,
      };
    });

  }, [columns, validationErrors, suppliers, subCategoryOptions, subCategoriesLoading]);
  
  const queryKey = `${entityType.toLowerCase()}s`;

  const createEntity = useMutation({
    mutationFn: async (values) => await POST(ENDPOINT, values),
    onSuccess: async () => {
      queryClient.invalidateQueries(queryKey);
      toast.success("Item created successfully");
      setLoading(true);
      updatedData(JSON.parse(sessionStorage.getItem(ENDPOINT)));
      setLoading(false);
    },
  });

  const updateEntity = useMutation({
    mutationFn: async (values) => await PUT(ENDPOINT, values.id, values),
    onSuccess: async () => {
      queryClient.invalidateQueries(ENDPOINT);
      toast.success("Item updated successfully");
    },
  });

  const deleteEntity = useMutation({
    mutationFn: async (id) => await DELETE_API(ENDPOINT, id),
    onSuccess: async () => {
      queryClient.invalidateQueries(ENDPOINT);
      toast.success("Item deleted successfully");
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

    try {
      const newValidationErrors = validateEntity(values);
      if (Object.values(newValidationErrors).some(Boolean)) {
        setValidationErrors(newValidationErrors);
        return;
      }
  
      // Perform mutation to update entity
      await updateEntity.mutateAsync(values);
  
      // Invalidate query and update data
      queryClient.invalidateQueries(ENDPOINT);
      toast.success("Item updated successfully");
  
      // Reset editing state
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error saving entity:", error);
      toast.error("Failed to save item. Please try again.");
    }

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
    createDisplayMode: "modal",
    editDisplayMode: "modal",
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

          {/* {entityType === "User" && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) =>
                table.setValueForField("password", e.target.value)
              }
            />
          )} */}

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
      <Box sx={{ display: "flex", gap: "1rem" }}>
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
