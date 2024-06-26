import { ArrowDown } from '@element-plus/icons-vue';
import { ref } from 'vue';

import type { BtnProps, ColumnProps, LinkProps, ScopeProps } from '../types';

const btnMax = 3;

const btnClickHandler = (btn: BtnProps | LinkProps, row: any) => (e: Event) => {
  e.stopPropagation();
  btn.handler(row, e);
};

const restBtnClickHandler = (index: number, btnList: BtnProps[], row: any) => {
  btnList[index].handler(row, undefined);
};

// 自定义渲染类型
export const typeRenders = {
  link: (scope: ScopeProps, config: ColumnProps) => {
    if (!config.linkAttr) {
      return '';
    }

    const linkConf = config.linkAttr;

    const disabled =
      linkConf.customDisabled && linkConf.customDisabled(scope.row, scope.column, scope.value, scope.$index);

    let text = scope.row[config.prop];
    if (config.formatter) {
      text = config.formatter(scope.row, scope.column, scope.value, scope.$index);
    }

    if (disabled) {
      return <span>{text}</span>;
    }

    return (
      <el-link onClick={btnClickHandler(linkConf, scope.row)} {...linkConf.opts}>
        {text}
      </el-link>
    );
  },
  btn: (scope: ScopeProps, config: ColumnProps) => {
    if (!config.btnList) {
      return '';
    }

    const btnList = config.btnList.filter((btn: BtnProps) => {
      if (btn.customShow && !btn.customShow(scope.row)) {
        return false;
      }
      return true;
    });

    function handleCommand(command: number) {
      restBtnClickHandler(command, btnList, scope.row);
    }

    let showBtnList: Array<BtnProps> = [];
    if (btnList.length === btnMax) {
      showBtnList = btnList.splice(0, btnMax);
    } else {
      showBtnList = btnList.splice(0, btnMax - 1);
    }

    return (
      <div class="btn-wrap">
        {showBtnList.map((btn: BtnProps) => {
          let { text } = btn;
          if (btn.formatter) {
            text = btn.formatter(scope.row);
          }
          const opts = { size: 'small', type: 'primary', plain: true, ...btn.opts };
          const disabled = btn.customDisabled && btn.customDisabled(scope.row);

          return (
            <el-button onClick={btnClickHandler(btn, scope.row)} disabled={disabled} {...opts}>
              {text}
            </el-button>
          );
        })}
        {btnList.length > 0 ? (
          <el-dropdown trigger="click" size="small" onCommand={handleCommand} style="margin-left: 10px;">
            {{
              default: () => {
                return (
                  <el-button type="primary" plain size="small">
                    更多
                    <el-icon class="el-icon--right">
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                );
              },
              dropdown: () => {
                return (
                  <el-dropdown-menu>
                    {btnList.map((btn: BtnProps, index: number) => {
                      let { text } = btn;
                      if (btn.formatter) {
                        text = btn.formatter(scope.row);
                      }
                      const disabled = btn.customDisabled && btn.customDisabled(scope.row);
                      return (
                        <el-dropdown-item command={index} disabled={disabled}>
                          {text}
                        </el-dropdown-item>
                      );
                    })}
                  </el-dropdown-menu>
                );
              },
            }}
          </el-dropdown>
        ) : null}
      </div>
    );
  },
  switch: (scope: ScopeProps, config: ColumnProps) => {
    if (!config.switchAttr) {
      return '';
    }
    const switchConf = config.switchAttr;
    const modelValue = ref(scope.row[config.prop]);

    return (
      <el-switch
        v-model={modelValue.value}
        onChange={(val: any) => switchConf.handler(scope.row, val)}
        {...switchConf.opts}
      ></el-switch>
    );
  },
};
