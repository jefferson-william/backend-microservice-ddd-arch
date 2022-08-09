const i18next = {
  t: (text: string) => {
    return eval(`require('../../../locales/pt-BR/translation.json').${text}`)
  },
  changeLanguage: () => new Promise(() => {}),
  use: () => {
    return i18next
  },
  init: async () => {
    return i18next
  },
}

export default i18next
