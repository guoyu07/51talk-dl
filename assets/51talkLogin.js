
define("login/user_login", [], function(require, exports, module) {
    function showError(a) {
        a.parent().addClass("input-error"),
        a.parent().siblings(".error").css("display", "block")
    }
    function showOff(a, r) {
        console.log(a);
        var e = $("#" + r);
        "" == e.val() ? (e.parent().siblings(".error").hide(),
        e.parent().removeClass("input-error"),
        e.parent().removeClass("correct")) : 1 == a ? e.parent().addClass("correct") : (e.parent().siblings(".error").show(),
        e.parent().removeClass("correct"))
    }
    function startLogin() {
        $("#LoginForm");
        $.ajax({
            url: $("#LoginForm").attr("action"),
            type: "post",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                la: $("#login_la").val(),
                client: $("#client").val(),
                lang: $("#lang").val(),
                from_url: $("#from_url").val(),
                autologin: $("#autologin").val()
            },
            success: function(a) {
                if (1e4 == a.code)
                    a.res.from_url ? window.location.href = a.res.from_url : window.location.reload();
                else {
                    $("#password2").parent().removeClass("correct");
                    var r = $("#password2").parent().siblings(".error").find("span");
                    r.text(a.message),
                    showError($("#password2")),
                    $("#password2").attr("name", "password2")
                }
            }
        })
    }
    function validateUsername() {
        var a = /^(([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6})|(1[0-9]{10})$/i
          , r = "username"
          , e = $("#" + r).val()
          , o = $("#" + r).parent().siblings(".error").find("span");
        return e ? a.test(e) ? ($.ajax({
            url: "http://login.51talk.com/ajax/mobile/check",
            data: {
                mobile: e,
                client: client
            },
            type: "post",
            async: !1,
            dataType: "json",
            success: function(a) {
                return (a.code = 1e4) ? void (flag = !0) : (o.text(a.message),
                showError($("#" + r)),
                void (flag = !1))
            },
            error: function() {
                alert("\u7f51\u7edc\u5f02\u5e38"),
                flag = !1
            }
        }),
        flag) : (o.text("\u7528\u6237\u540d\u683c\u5f0f\u9519\u8bef"),
        showError($("#" + r)),
        !1) : (o.text("\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801\u6216\u90ae\u7bb1"),
        showError($("#" + r)),
        !1)
    }
    function validatePassword2() {
        var a = /^[\w\+\!\@\#\$\%\^\&\*\(\)]{6,20}$/
          , r = "password2"
          , e = $("#" + r).val()
          , o = $("#" + r).parent().siblings(".error").find("span");
        return e ? a.test(e) ? !0 : (o.text("\u5bc6\u7801\u957f\u5ea6\u53ea\u80fd\u662f6-20\u4f4d\u5b57\u7b26"),
        showError($("#" + r)),
        !1) : (o.text("\u8bf7\u8f93\u5165\u5bc6\u7801"),
        showError($("#" + r)),
        !1)
    }
    document.domain = "51talk.com",
    $(".s-input,.m-code-input").focus(function() {
        $(this).parent().siblings(".error").hide(),
        $(this).parent().removeClass("input-error")
    }),
    $(".s-input").blur(function() {
        var id = $(this).attr("id")
          , fullName = "var value = validate" + id.substring(0, 1).toUpperCase() + id.substring(1) + "()";
        eval(fullName),
        showOff(value, id)
    });
    var flag = !0
      , client = $("#client").val();
    $("#LoginForm").on("submit", function(a) {
        var r = $(this);
        if (r.attr("submited"))
            return !0;
        var e = $("#login_la").val()
          , o = $("#public_key").val()
          , t = $("#password2").val();
        o || ssoController.getPublicKey();
        var s = new JSEncrypt;
        s.setPublicKey(o);
        var n = s.encrypt(t);
        return $("#password").val(n),
        n && "false" != n || $("#password").val(hex_md5(t)),
        e ? ($("#password2").removeAttr("name"),
        startLogin()) : ssoController.preLogin(),
        !1
    }),
    $("#login").click(function() {
        return validateUsername() && validatePassword2() ? void $("#LoginForm").submit() : flag = !1
    }),
    window.ssoController = {
        preLogin: function() {
            $.ajax({
                url: "http://login.51talk.com/sso/prelogin",
                dataType: "jsonp",
                jsonpCallback: "preLoginCallBack",
                data: $("#LoginForm").serialize(),
                type: "get",
                success: function(a) {
                    $("#login_la").val(a.res.la),
                    $("#password2").removeAttr("name"),
                    startLogin()
                }
            })
        },
        feedBack: function(dataObj) {
            var data = eval(dataObj);
            1e4 == data.code ? data.from_url ? top.location.href = data.from_url : top.location.reload() : (alert(data.msg),
            $("#password2").attr("name", "password2"),
            $("#LoginForm").removeAttr("submited").find(".jsSubmit").val("\u767b\u5f55"))
        },
        getPublicKey: function() {
            var a = $("input[name=client]").val() || 1;
            $("#public_key").val() || $.ajax({
                url: "http://login.51talk.com/sso/publickey",
                dataType: "jsonp",
                jsonpCallback: "pubkeyCallBack",
                data: {
                    client: a
                },
                type: "get",
                success: function(a) {
                    $("#public_key").val(a.res.rsa_pub)
                }
            })
        }
    },
    function() {
        var a = $("#LoginForm");
        $("body").append("<iframe id='ssoLoginFrame' name='ssoLoginFrame' width='0' height='0' style='display:none;'></iframe>"),
        ssoController.getPublicKey(),
        $("#username").blur(function() {
            return $.ajax({
                url: "http://login.51talk.com/sso/prelogin",
                dataType: "jsonp",
                jsonpCallback: "preLoginCallBack",
                data: a.serialize(),
                type: "get",
                success: function(a) {
                    $("#login_la").val(a.res.la)
                }
            }),
            !1
        }).focus(function() {
            ssoController.getPublicKey()
        }),
        $("#password").focus(function() {
            ssoController.getPublicKey()
        })
    }(),
    $("#checkbox").click(function() {
        $(this).toggleClass("checked"),
        $(this).hasClass("checked") ? ($(".inputChed").val("1"),
        $(".inputChed").parent().siblings(".error").hide()) : $(".inputChed").val("0")
    })
});

