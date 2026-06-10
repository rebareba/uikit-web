import {type ThemeConfig} from 'antd'
// import tinycolor from 'tinycolor2'

export function generateLightTheme(primaryColor: string): ThemeConfig {
  return {
    cssVar: true,
    token: {
      // colorPrimary: primaryColor,
      // colorLink: primaryColor,
      // colorBgLayout: 'rgb(248, 248, 248)',
      // colorBgTextHover: tinycolor(primaryColor).setAlpha(0.09).toRgbString(),
      // controlItemBgActive: tinycolor(primaryColor).setAlpha(0.2).toRgbString(),
      // controlItemBgActiveHover: tinycolor(primaryColor).setAlpha(0.25).toRgbString(),
      // controlItemBgHover: tinycolor(primaryColor).setAlpha(0.1).toRgbString(),

      colorPrimary: '#276EFE',
      colorLink: '#276EFE',
      colorTextBase: '#1d2129',
      colorInfo: '#276EFE',
      colorError: '#f53f3f',
      colorSuccess: '#00b42a',
      colorWarning: '#ff7d00',
      colorPrimaryBgHover: '#8ab9ff',
      colorSuccessBg: '#00b42a',
    },
    components: {
      Table: {
        // headerBg: 'rgb(247, 248, 250)',
        headerBg: '#F4F7FE',
        headerColor: '#1d2129',
        headerBorderRadius: 0,
        headerSortActiveBg: '#F4F7FE',
        headerSortHoverBg: '#F4F7FE',
      },
      Menu: {
        // itemHeight: 50,
        // iconSize: 18,
        // collapsedIconSize: 18,
        // itemColor: 'rgba(0, 0, 0, 0.88)',
        // groupTitleColor: 'rgba(0, 0, 0, 0.88)',
        // itemActiveBg: tinycolor(primaryColor).setAlpha(0.1).toRgbString(),
        // itemHoverBg: tinycolor(primaryColor).setAlpha(0.1).toRgbString(),
        // itemSelectedBg: tinycolor(primaryColor).setAlpha(0.1).toRgbString(),
        // itemHoverColor: primaryColor,
        // itemSelectedColor: primaryColor,
        // subMenuItemBg: 'rgba(0, 0, 0, 0)',
        fontSize: 14,
        itemHeight: 40,
        itemHoverBg: '#E9F0FE',
        itemSelectedBg: '#E9F0FE',
        itemHoverColor: '#276EFE',
        iconSize: 18,
        collapsedIconSize: 18,
        collapsedWidth: 48,
      },
    },
  }
}
