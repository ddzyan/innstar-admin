import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import { useAppStore } from '@/store/module/app'
import { useAdminStore } from '@/store/module/admin'

const store = createPinia()
store.use(piniaPluginPersist)

export { useAppStore, useAdminStore }

export default store
