export const getRolPath = (rol) => {
  const paths = {
    admin: '/dashboard',
    donante: '/donaciones',
    municipalidad: '/necesidades',
    operador: '/inventario',
  }
  return paths[rol] || '/'
}