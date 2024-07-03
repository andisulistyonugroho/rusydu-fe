// In Setup Stores:
// ref()s become state properties
// computed()s become getters
// function()s become actions
import {useAuthStore} from './auth'
export const useMenuStore = defineStore('menu',() => {
  const {user} = useAuthStore()
  
  const menus = ref([
    {
      title: 'Dashboard',
      link: '/member/dashboard',
      roles: ['$authenticated']
    },
    {
      title: 'Belanja',
      link: '/member/shop',
      roles: ['$authenticated']
    },
    {
      title: 'Iuran Wajib',
      link: '/saving/mandatory',
      roles: ['superadmin']
    },
    {
      title: 'Pengaturan',
      link: '#',
      roles: ['superadmin'],
      child: [
        {title: 'Produk',link:'/product',roles: ['superadmin']},
        {
          title: 'User',
          link: '/user',
          roles: ['superadmin']
        },
      ]
    }
  ])

  const openmenu = computed(() => {
    const menu = menus.value
    const mm = menu.filter(obj => obj.roles.includes(user.role) || (user.role && obj.roles.includes('$authenticated')))
    return mm
  })
  
  return {openmenu}
})