import {i18n, t} from '@utils/i18n'
import {Dropdown} from 'antd'
import ThemeButton from './icons/theme-button'
import {IconShuyiFanyi36} from './icons/shuyi_fanyi-36'

interface Props {
  lang: string
  setLang: (lang: string) => void
}

const LangDropdown = ({setLang, lang}: Props) => {
  const languages = [
    {
      key: 'zh',
      name: '中文',
    },
    {
      key: 'en',
      name: 'English',
    },
  ]
  return (
    <Dropdown
      menu={{
        items: languages.map(language => ({
          label: `${t(language.name)}`,
          key: language.key,
        })),
        onClick: async ({key}) => {
          await i18n.changeLanguage(key)
          setLang(key)
        },
        selectedKeys: [lang],
      }}
      trigger={['click']}
      placement="bottom"
    >
      <div>
        <ThemeButton className="text-[20px]">
          <IconShuyiFanyi36 />
        </ThemeButton>
      </div>
    </Dropdown>
  )
}

export default LangDropdown
