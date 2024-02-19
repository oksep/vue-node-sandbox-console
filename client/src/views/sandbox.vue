<template>
  <div class="sandbox-root">
    <div class="code-editor-container">
      <CodeEditor
        ref="ce"
        height="100%"
        class="code-editor-content"
        theme="dark"
        v-model="codeData"
        border_radius="8px"
        :language_selector="true"
        :autofocus="true"
        font_size="0.75rem">
      </CodeEditor>
      <el-button
        class="code-run-btn"
        icon="el-icon-caret-right"
        :round="true"
        type="success"
        @click='handleRun'
        :disabled="isLoading"
        :loading="isLoading">
        {{ isLoading ? '执行中' : '执行' }}
      </el-button>
    </div>
    <div class="code-console-root">
      <div class="code-console-container">
        <h4 class="console-title">Result:</h4>
        <div class="console-content">
          <pre>{{ runResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CodeEditor from 'simple-code-editor';

const tip = ` You could only use the following node modules:
- require
- console
- app_config
- xxx`;

export default {
  components: {
    CodeEditor,
  },
  data() {
    return {
      codeData: '',
      runResult: '',
      isLoading: false,
    };
  },
  created() {
    // no-ops
    const code = localStorage.getItem('lastEditCode');
    this.codeData = code || '// Type your JavaScript code here \n// Dangerous edit, test your code locally!!! \n';
    console.warn('tip', tip);
  },
  mounted() {
    const elements = this.$refs.ce.$el.getElementsByTagName('textarea');
    if (elements) {
      for (const element of elements) {
        let down = false;
        element.spellcheck = false;
        element.onkeyup = (event) => {
          down = false;
          event.stopPropagation();
        };
        element.onkeydown = (event) => {
          if (event.code === 'MetaLeft' || event.code === 'MetaRight') {
            down = true;
          }
          if (event.code === 'Slash') {
            if (down) {
              const preStart = element.selectionStart;
              const lines = element.value.substring(0, element.selectionStart).split(/\r?\n|\r/);
              if (lines.length === 1) {
                element.selectionStart = 0;
                element.selectionEnd = element.selectionStart;
              } else {
                const length = lines.map((l) => l.length).reduce((p, c, i, a) => {
                  if (i === a.length - 1) return p;
                  return p + c;
                });
                element.selectionStart = (length + lines.length - 1);
                element.selectionEnd = element.selectionStart;
              }
              document.execCommand('insertText', false, '// ');
              element.selectionStart = preStart + 3;
            } else {
              window.event.returnValue = false;
            }
          }
          event.stopPropagation();
        };
      }
    }
  },
  methods: {
    handleRun() {
      this.isLoading = true;
      const triggerTime = new Date().getMilliseconds();
      const payload = {
        codeData: this.codeData,
      };
      this.$service.exeCodeInSandbox(payload)
        .then(data => {
          this.runResult = data.result;
          this.recoverState(triggerTime);
        })
        .catch(err => {
          this.recoverState(triggerTime);
        });
      localStorage.setItem('lastEditCode', this.codeData);
    },
    recoverState(triggerTime) {
      const currentTime = new Date().getMilliseconds();
      if (currentTime - triggerTime < 1000) {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      } else {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.sandbox-root {
  height: calc(100vh) !important;
  min-height: calc(100vh);
  width: 100%;
  background-color: #1C1E1EFF;
  display: flex;
  flex-direction: column;

  ::selection {
    background: #324253;
    color: #6383a6;
  }
}

.code-editor-container {
  width: 100%;
  flex: 1;
  position: relative;
  padding: 1%;
  height: 50%;
}

.code-editor-content {
  width: 100% !important;
  flex: 1;
}

.code-run-btn {
  position: absolute;
  right: 2%;
  bottom: 7%;
  z-index: 100;
}

.code-console-root {
  width: 100%;
  flex: 1;
  height: 50%;
  padding: 0 1% 1% 1%;
}

.code-console-container {
  width: 100%;
  height: 100%;
  background-color: #282C34FF;
  color: #A3ACB8FF;
  font-size: .75rem;
  border-radius: 8px;
  padding: 1%;
  display: flex;
  flex-direction: column;
}

.console-title {
  color: #6c8fc0;
}

.console-content {
  overflow: auto;
  flex: 1;
}
</style>
