<template>
  <div class="login">
    <div class="flex-c absolute right-5">
      <el-switch v-model="dataTheme" inline-prompt :active-icon="dayIcon" :inactive-icon="darkIcon"
        @change="dataThemeChange" />
    </div>
    <Motion>
      <Header :close-eyes="isFocus" />
    </Motion>
    <Motion :delay="100">
      <div class="login-box">
        <!-- box 标题 -->
        <div class="title">
          <img src="@/assets/login/logo.png" />
        </div>
        <div class="content">
          <el-form ref="loginForm" :model="formData" :rules="rules" @keyup.enter="handleLogin">
            <Motion :delay="150">
              <el-form-item prop="phonenumber">
                <el-input v-model.trim="formData.phonenumber" placeholder="手机号" type="text" tabindex="1"
                  :prefix-icon="useRenderIcon(Phone)" size="large" />
              </el-form-item>
            </Motion>
            <Motion :delay="200">
              <el-form-item prop="verificationcode">
                <div class="verification-code">
                  <el-input v-model.trim="formData.verificationcode" placeholder="验证码" tabindex="3"
                    :prefix-icon="useRenderIcon(Coin)" maxlength="4" minlength="4" size="large" @blur="handleBlur"
                    @focus="handleFocus">
                  </el-input>
                  <el-button :icon="useRenderIcon(Message)" @click="sendCode" color="#626aef"
                    :disabled="!buttonEvent.enableSendMsg" slot="append">{{
                      buttonEvent.placeholder }}</el-button>
                </div>
              </el-form-item>
            </Motion>
            <Motion :delay="250">
              <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">登
                录</el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </Motion>
  </div>
</template>

<script setup lang="ts">
  import Motion from "./utils/motion";
  import { useRouter } from "vue-router";
  import { message } from "@/utils/message";
  import { loginRules } from "./utils/rule";
  import { useNav } from "@/layout/hooks/useNav";
  import type { FormInstance } from "element-plus";
  import { useLayout } from "@/layout/hooks/useLayout";
  import { useUserStoreHook } from "@/store/modules/user";
  // import { initRouter, getTopMenu } from "@/router/utils";
  import { useRenderIcon } from "@/components/ReIcon/src/hooks";
  import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
  import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
  import { setToken } from "@/utils/auth";
  import { addPathMatch, getTopMenu } from "@/router/utils";
  import { usePermissionStoreHook } from "@/store/modules/permission";
  import dayIcon from "@/assets/svg/day.svg?component";
  import darkIcon from "@/assets/svg/dark.svg?component";
  import Coin from "@iconify-icons/ep/coin"
  import Message from "@iconify-icons/ri/message-fill"
  import Phone from "@iconify-icons/ri/phone-fill";
  import Header from "./compontents/header.vue";
  import { useFocus } from "./utils/header"
  import { tr } from "element-plus/es/locale/index.mjs";
  // import { Phone, Message, Coin } from "@element-plus/icons-vue"
  // import { Lock, Phone, Message, Coin } from "@element-plus/icons-vue"
  const { isFocus, handleBlur, handleFocus } = useFocus()
  defineOptions({
    name: "Login"
  });
  const formData = ref({
    phonenumber: "",
    verificationcode: ""
  });
  const router = useRouter();
  const loading = ref(false);
  const ruleFormRef = ref<FormInstance>();

  const { initStorage } = useLayout();
  initStorage();

  const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
  dataThemeChange(overallStyle.value);
  const { title } = useNav();

  const ruleForm = reactive({
    phoneNumber: "",
    code: ""
  });
  /** 登录表单校验规则 */
  const rules = {
    phonenumber: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
    verificationcode: [{ required: true, message: "请输入短信验证码", trigger: "blur" }]
  }
  const handleLogin = () => { }

  const buttonEvent = ref({
    enableSendMsg: true,
    enableSubmitForm: false,
    countDown: 30,
    placeholder: "发送短信验证码"
  })
  // 发送短信验证码
  const sendCode = () => {
    // sendVerificationCode(formData.value.phonenumber).then(
    //   (res) => {
    //     console.log(res);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // )
    buttonEvent.value.enableSendMsg = false
    // 执行重发任务
    const cron = setInterval(() => {
      buttonEvent.value.countDown--
      buttonEvent.value.placeholder = buttonEvent.value.countDown + '秒后重新发送'
      if (buttonEvent.value.countDown <= 0) {
        // 清理定时任务
        clearInterval(cron)
        buttonEvent.value.enableSendMsg = true
        buttonEvent.value.placeholder = "重新发送"
        buttonEvent.value.countDown = 5
      }
    }, 1000);
  }


  // 静态路由
  const onLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(valid => {
      if (valid) {

        // d

        loading.value = true;
        setToken({
          username: "admin",
          roles: ["admin"],
          accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
        } as any);
        // 全部采取静态路由模式
        usePermissionStoreHook().handleWholeMenus([]);
        addPathMatch();
        router.push(getTopMenu(true).path);
        message("登录成功", { type: "success" });
        loading.value = false;
      }
    });
  };

  /** 使用公共函数，避免`removeEventListener`失效 */
  function onkeypress({ code }: KeyboardEvent) {
    if (["Enter", "NumpadEnter"].includes(code)) {
      onLogin(ruleFormRef.value);
    }
  }

  onMounted(() => {
    window.document.addEventListener("keypress", onkeypress);
  });

  onBeforeUnmount(() => {
    window.document.removeEventListener("keypress", onkeypress);
  });
</script>
<style lang="scss" scoped>
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100%;

    .login-box {
      width: 480px;
      max-width: 90%;
      border-radius: 20px;
      box-shadow: 0 0 10px #dcdfe6;
      background-color: var(--el-bg-color);
      overflow: hidden;

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;

        img {
          height: 100%;
        }
      }

      .content {
        padding: 20px 50px 50px 50px;

        :deep(.el-input-group__append) {
          padding: 0;
          overflow: hidden;

          .el-image {
            width: 100px;
            height: 40px;
            border-left: 0px;
            user-select: none;
            cursor: pointer;
            text-align: center;
          }
        }

        .verification-code {
          display: flex;
          width: 100%;

          // 针对 el-input 的内部样式
          .el-button {
            flex-shrink: 0;
            width: 150px;
            height: 40px; // 设置相同高度
            line-height: 40px; // 确保文字垂直居中
          }
        }
      }

      .el-button {
        width: 100%;
      }


    }
  }
</style>
