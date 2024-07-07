const validateRequired = (value) => !!value && value.length > 0;
const validateEmail = (email) =>
  !!email &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validatePhone = (phone) => !!phone && phone.match(/^\d+$/);

const validateDate = (date) => !!date && !isNaN(new Date(date).getTime());

function validateUser(user) {
  return {
    first_name: !validateRequired(user.first_name)
      ? "First name is required"
      : "",
    last_name: !validateRequired(user.last_name) ? "Last name is required" : "",
    email: !validateEmail(user.email) ? "Invalid email format" : "",
    role: !validateEmail(user.role) ? "Role is required" : "",
  };
}

function validateClient(client) {
  return {
    first_name: !validateRequired(client.first_name)
      ? "First name is required"
      : "",
    last_name: !validateRequired(client.last_name)
      ? "Last name is required"
      : "",
    email: !validateEmail(client.email) ? "Invalid email format" : "",
    phone: !validatePhone(client.phone)
      ? "Phone number should contain only digits"
      : "",
    raison_sociale: !validateRequired(client.raison_sociale)
      ? "Raison Sociale is required"
      : "",
    CIN_ICE: !validateRequired(client.CIN_ICE) ? "CIN or ICE is required" : "",
    type: !validateRequired(client.type) ? "Client type is required" : "",
    role: !validateRequired(client.role) ? "Client role is required" : "",
    address_exploitation: !validateRequired(client.address_exploitation)
      ? "Exploitation address is required"
      : "",
    address_facturation: !validateRequired(client.address_facturation)
      ? "Billing address is required"
      : "",
  };
}

function validateProduct(product) {
  return {
    designation: !validateRequired(product.designation)
      ? "Designation is required"
      : "",
    supplier: !validateRequired(product.supplier) ? "Supplier is required" : "",
    group: !validateRequired(product.group) ? "Group is required" : "",
    marge_brut: !validateRequired(product.marge_brut)
      ? "Marge Brut is required"
      : "",
    prix_achat: !validateRequired(product.prix_achat)
      ? "Prix Achat is required"
      : "",
    prix_tarif: !validateRequired(product.prix_tarif)
      ? "Prix Tarif is required"
      : "",
    prix_vente: !validateRequired(product.prix_vente)
      ? "Prix Vente is required"
      : "",
    prix_vente_net: !validateRequired(product.prix_vente_net)
      ? "Prix Vente Net is required"
      : "",
    remise: !validateRequired(product.remise) ? "Remise is required" : "",
    reference: !validateRequired(product.reference)
      ? "Reference is required"
      : "",
  };
}

function validateSupplier(supplier) {
  return {
    name: !validateRequired(supplier.name) ? 'Supplier name is required' : '',
    remise_f: !validateRequired(supplier.remise_f) ? 'Remise is required' : '',
    remise_f_composition: !validateRequired(supplier.remise_f_composition) ? 'Remise Composition is required' : '',
  };
}


function validateCategory(category) {
    return {
      name: !validateRequired(category.name) ? 'Category name is required' : '',
    };
  }
export { validateUser, validateClient, validateProduct, validateSupplier, validateCategory };
