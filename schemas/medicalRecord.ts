export default {
  name: 'medicalRecord',
  title: 'Cartella Clinica',
  type: 'document',
  fields: [
    { name: 'username', title: 'Username', type: 'string' },
    { name: 'visitType', title: 'Tipo Visita', type: 'string' },
    { name: 'diagnosis', title: 'Diagnosi', type: 'string' },
    { name: 'date', title: 'Data', type: 'string' },
  ],
}
