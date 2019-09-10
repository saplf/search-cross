// ==UserScript==
// @name         Search Cross
// @namespace    https://github.com/saplf/search-cross
// @version      0.2
// @description  不同搜索引擎间的切换，自用
// @author       saplf
// @license      GPL-3.0
// @supportURL   https://github.com/saplf/search-cross
// @match        *://www.baidu.com/s?*
// @match        *://www.google.com/search?*
// @match        *://cn.bing.com/search?*
// @match        *://www.so.com/*
// @match        *://github.com/search?*
// @match        *://www.zhihu.com/search?*
// @match        *://search.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @run-at       document-end
// ==/UserScript==

var config = {
    default: {
        position: 'left', // 'left' or 'right'
        height: 54,
        top: '120px',
        peekSize: 30,
        delayEnter: 120,
        delayLeave: 400,
        zIndex: 9999,
        triggleVer: '10px',
        triggleHor: '20px',
    },
    'www.google.com': {
        top: '140px',
    },
};

var engines = {
    'www.baidu.com': {
        name: '百度',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTA5MTQxNzAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2MDgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjE3LjA5MDgyOCA1MzQuNDkwMjI0Yzk5LjY4MzMyNy0yMC45MjY2MTIgODYuMTIxNDUtMTM3LjM0MzA0MSA4My4xMjgyNzktMTYyLjgzODcxNS00LjkwNjc1My0zOS4yMjMzMjctNTIuMTEyODkxLTEwNy44MTI0NzEtMTE2LjIxNzkwOC0xMDIuMzcyNTc1LTgwLjY5MzgzNCA3LjA1ODc2Ni05Mi40ODc0MzggMTIwLjk0ODY1My05Mi40ODc0MzggMTIwLjk0ODY1M0M4MC41ODM4MjggNDQyLjkyNzg1NSAxMTcuNjU0MTE5IDU1NS40NDk1ODEgMjE3LjA5MDgyOCA1MzQuNDkwMjI0TDIxNy4wOTA4MjggNTM0LjQ5MDIyNHpNMzIyLjkzNjUwNSA3MzcuMDA0NTY3Yy0yLjkwNzIxMyA4LjIxMTAwOS05LjQxMzM5NCAyOS4xNzAzNjYtMy43ODExMTYgNDcuMzgxMTI0IDExLjEyMzMzOCA0MC44NzQ5NDMgNTEuMTA4MDA1IDM0LjIwODEwMyA1MS4xMDgwMDUgMzQuMjA4MTAzbDU2LjAzNDIwMSAwTDQyNi4yOTc1OTQgNzA2LjUyNTM5MmwtNTYuMDM0MjAxIDBDMzQ1LjE1ODYyMiA3MTMuODY0NTQ0IDMyNS42NTU0MyA3MjguODUyOTEgMzIyLjkzNjUwNSA3MzcuMDA0NTY3TDMyMi45MzY1MDUgNzM3LjAwNDU2N3pNNDAyLjE0NDQ5OCAzMzkuMjMzMTY4YzU1LjA4MTUwMyAwIDk5LjU3NTg4LTYxLjk0Njg2NCA5OS41NzU4OC0xMzguNDYxNTE1IDAtNzYuNDkxMTE1LTQ0LjQ5NDM3Ny0xMzguNDA3MjgtOTkuNTc1ODgtMTM4LjQwNzI4LTU0Ljk3NDA1NiAwLTk5LjU5OTQxNiA2MS45MTYxNjUtOTkuNTk5NDE2IDEzOC40MDcyOEMzMDIuNTQ1MDgyIDI3Ny4yODYzMDQgMzQ3LjE3MDQ0MiAzMzkuMjMzMTY4IDQwMi4xNDQ0OTggMzM5LjIzMzE2OEw0MDIuMTQ0NDk4IDMzOS4yMzMxNjh6TTYzOS4yODg1NDYgMzQ4LjM5NTg1MmM3My42MzUwNjcgOS4zMzE1MjkgMTIwLjkyNTExNy02Ny40MDcyMjYgMTMwLjM0MDU1Ny0xMjUuNTcxOTUgOS41ODIyMzktNTguMDgxODM3LTM3LjkwNjMzMi0xMjUuNTc3MDY3LTkwLjAyNDMzOS0xMzcuMTc0MTk2LTUyLjIxOTMxNS0xMS43MTI3NjMtMTE3LjM5MDYxNyA3MC4wNDQyODYtMTIzLjMyOTg4NiAxMjMuMzA1MzI3QzU0OS4xODc0NTkgMjc0LjA5NDYxMiA1NjUuODUzMDI0IDMzOS4xNDkyNTcgNjM5LjI4ODU0NiAzNDguMzk1ODUyTDYzOS4yODg1NDYgMzQ4LjM5NTg1MnpNODE5LjY0MjE3MSA2OTAuMzgwNjljMCAwLTExMy44NjYzNTEtODYuMTIxNDUtMTgwLjM3NzE2LTE3OS4xNjc2MTItOTAuMTA4MjUxLTEzNy4xNzYyNDMtMjE4LjEyMTgwOS04MS4zNjcxNjktMjYwLjkwODI4OC0xMS42MDQyOTJDMzM1Ljc0NTIyOSA1NjkuMzcyNjg1IDI2OS4yODY2MDggNjEzLjQ3NzE4MiAyNTkuODQxNDkxIDYyNS4xODc4OTljLTkuNTUyNTYzIDExLjQ4OTY4Mi0xMzcuNTA5ODQgNzkuMDEwNDk1LTEwOS4xMjg0NDMgMjAyLjMxNDc5OXMxMzUuNDk4MDIgMTMxLjE4MDY5MSAxMzUuNDk4MDIgMTMxLjE4MDY5MSA2Ni4yMDM4MTgtMy4xNjgxNTYgMTUxLjUxNzg3OS0yMS44MjkxNjhjODUuMzEyMDE0LTE4LjQ4NzA1IDE1OC44MzM0OTUgNC41OTg3MzggMTU4LjgzMzQ5NSA0LjU5ODczOHMxOTkuMzIwNjA1IDY1LjIyMzQ5IDI1My44NjY5MTgtNjAuMzU0NkM5MDQuODk3OTAzIDc1NS40OTc3NTcgODE5LjY0MjE3MSA2OTAuMzgwNjkgODE5LjY0MjE3MSA2OTAuMzgwNjlMODE5LjY0MjE3MSA2OTAuMzgwNjl6TTQ4Mi4zMzM4NDIgODc0LjYyOTAxOCAzNDIuMjQxMTc2IDg3NC42MjkwMThjLTU1Ljk0NjE5Ni0xLjMxMzkyNS03MS41NTI2MzktNDUuNTg3MjY4LTc0LjM1NDQ1Mi01MS45NDMwMjMtMi43NzcyNTMtNi40NzM0MzUtMTguNjA2Nzc3LTM2LjQ3ODgxOS0xMC4yMjY5MjItODcuNDczMjM3IDI0LjE3OTcwMi03Ni40OTAwOTIgODQuNjEzMDk2LTg0LjY5NTk4NCA4NC42MTMwOTYtODQuNjk1OTg0bDg0LjA1MzM0OCAwTDQyNi4zMjYyNDcgNTY2LjQ2NDQ0OWw1Ni4wMzYyNDcgMCAwIDMwOC4xNjQ1NjhMNDgyLjMzMzg0MiA4NzQuNjI5MDE4ek03MDYuNDc4ODMxIDg3NC42MjkwMThsLTE0MC4wOTA2MTkgMGMtNTUuMTY3NDYtMi4zNTU2NTEtNTYuMTI0MjUyLTUyLjkyNzQ0My01Ni4xMjQyNTItNTIuOTI3NDQzbDAuMDg2OTgxLTE3MS4yMTU1IDU2LjAzNzI3MSAwTDU2Ni4zODgyMTMgNzkwLjU3ODc0YzMuNjk3MjA1IDE1LjQzODYyMSAyOC4wMTYwNzcgMjguMDE1MDU0IDI4LjAxNjA3NyAyOC4wMTUwNTRsNTYuMDM3MjcxIDBMNjUwLjQ0MTU2MSA2NTAuNDg2MDc0bDU2LjAzODI5NCAwTDcwNi40Nzk4NTUgODc0LjYyOTAxOCA3MDYuNDc4ODMxIDg3NC42MjkwMTh6TTkzMS4wMzcyMzcgNDQ2LjA2NjMzNWMwLTI3LjgxNjUzMi0yMy42NzUyMTItMTExLjYxNzEyNC0xMTEuMzk1MDY2LTExMS42MTcxMjQtODcuOTE5Mzk5IDAtOTkuNjYwODE0IDc5LjA5MzM4My05OS42NjA4MTQgMTM1LjAxNjA0MyAwIDUzLjM0NDk1MiA0LjU5MjU5OCAxMjcuODE2MDYxIDExMy44MDY5OTkgMTI1LjQ5MDA4NkM5NDMuMDAwNzEgNTkyLjYzMzQ1OSA5MzEuMDM3MjM3IDQ3NC4wNTg4NzYgOTMxLjAzNzIzNyA0NDYuMDY2MzM1TDkzMS4wMzcyMzcgNDQ2LjA2NjMzNXpNOTMxLjAzNzIzNyA0NDYuMDY2MzM1IiBwLWlkPSIxNjA5Ij48L3BhdGg+PC9zdmc+',
        url: 'https://www.baidu.com/s?wd={q}',
    },
    'www.google.com': {
        name: 'Google',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTExODcxNDQ0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0NTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODgxIDQ0Mi40SDUxOS43djE0OC41aDIwNi40Yy04LjkgNDgtMzUuOSA4OC42LTc2LjYgMTE1LjgtMzQuNCAyMy03OC4zIDM2LjYtMTI5LjkgMzYuNi05OS45IDAtMTg0LjQtNjcuNS0yMTQuNi0xNTguMi03LjYtMjMtMTItNDcuNi0xMi03Mi45czQuNC00OS45IDEyLTcyLjljMzAuMy05MC42IDExNC44LTE1OC4xIDIxNC43LTE1OC4xIDU2LjMgMCAxMDYuOCAxOS40IDE0Ni42IDU3LjRsMTEwLTExMC4xYy02Ni41LTYyLTE1My4yLTEwMC0yNTYuNi0xMDAtMTQ5LjkgMC0yNzkuNiA4Ni0zNDIuNyAyMTEuNC0yNiA1MS44LTQwLjggMTEwLjQtNDAuOCAxNzIuNFMxNTEgNjMyLjggMTc3IDY4NC42QzI0MC4xIDgxMCAzNjkuOCA4OTYgNTE5LjcgODk2YzEwMy42IDAgMTkwLjQtMzQuNCAyNTMuOC05MyA3Mi41LTY2LjggMTE0LjQtMTY1LjIgMTE0LjQtMjgyLjEgMC0yNy4yLTIuNC01My4zLTYuOS03OC41eiIgcC1pZD0iMzQ1OCI+PC9wYXRoPjwvc3ZnPg==',
        url: 'https://www.google.com/search?q={q}',
    },
    'cn.bing.com': {
        name: 'Bing',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTA5MTYzNjY3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTExLjM2IDQyNi42NjY2NjdMNDMzLjQ5MzMzMyAyMzguOTMzMzMzYy02LjgyNjY2Ny0zLjQxMzMzMy0xMy42NTMzMzMgMC0xNy4wNjY2NjYgMy40MTMzMzQtNi44MjY2NjcgNi44MjY2NjctNi44MjY2NjcgMTMuNjUzMzMzLTYuODI2NjY3IDIwLjQ4bDEwMi40IDIzOC45MzMzMzMgMTAuMjQgMTAuMjQgMTQ2Ljc3MzMzMyA0MC45Ni00MTYuNDI2NjY2IDIyNS4yOCAxMTYuMDUzMzMzLTk4Ljk4NjY2N2MzLjQxMzMzMy0zLjQxMzMzMyA2LjgyNjY2Ny02LjgyNjY2NyA2LjgyNjY2Ny0xMy42NTMzMzNWMTAyLjRjMC02LjgyNjY2Ny0zLjQxMzMzMy0xMy42NTMzMzMtMTAuMjQtMTcuMDY2NjY3TDEyNi4yOTMzMzMgMGMtNi44MjY2NjcgMC0xMy42NTMzMzMgMC0xNy4wNjY2NjYgMy40MTMzMzMtMy40MTMzMzMgMy40MTMzMzMtNi44MjY2NjcgNi44MjY2NjctNi44MjY2NjcgMTMuNjUzMzM0djg1My4zMzMzMzNjMCAzLjQxMzMzMyAwIDMuNDEzMzMzIDMuNDEzMzMzIDYuODI2NjY3bDMuNDEzMzM0IDMuNDEzMzMzIDMuNDEzMzMzIDMuNDEzMzMzIDIzOC45MzMzMzMgMTM2LjUzMzMzNGMzLjQxMzMzMyAwIDYuODI2NjY3IDMuNDEzMzMzIDYuODI2NjY3IDMuNDEzMzMzIDMuNDEzMzMzIDAgNi44MjY2NjcgMCAxMC4yNC0zLjQxMzMzM2w1NDYuMTMzMzMzLTM0MS4zMzMzMzRjMy40MTMzMzMtMy40MTMzMzMgNi44MjY2NjctMTAuMjQgNi44MjY2NjctMTMuNjUzMzMzVjQ0My43MzMzMzNjMC02LjgyNjY2Ny0zLjQxMzMzMy0xMy42NTMzMzMtMTAuMjQtMTcuMDY2NjY2eiIgZmlsbD0iIiBwLWlkPSIyNzE4Ij48L3BhdGg+PC9zdmc+',
        url: 'https://cn.bing.com/search?q={q}',
    },
    'www.so.com': {
        name: '360',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTEyNTc0ODM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQxODEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTU4LjI0Mzc5NCAxMzQuNTE1MDQxYy0zMy4yOTc5OTMtMTYuMTA4OTk3LTY4LjQwOTk4NS0yMy43NDI5OTUtMTA0LjQ2Mjk3Ny0yNy41OTY5OTQtNy45MTk5OTgtMC44NDgtMTYuMDA5OTk3LTAuMTI1LTI2LjUzMDk5NS0wLjEyNUM5NTMuNDM1Nzk1IDIxMS4yNTAwMjUgMTAyMS4xOTM3ODEgMzQyLjk0OTk5NiAxMDIzLjkxODc4IDUwNC4zOTk5NjJjMi4zMDkgMTM2LjY5OTk3MS00NC44Mjc5OSAyNTYuMzE3OTQ1LTEzOC4wMjE5NyAzNTcuMjM4OTIzLTE3Ny40Njk5NjIgMTkyLjE5Mjk1OS00OTcuNzcyODkzIDIyOS4wODY5NTEtNzIyLjQxNjg0NSAyNy4yNTg5OTQtNS43NzA5OTkgMzcuMjU3OTkyLTQuNzMwOTk5IDczLjc1NTk4NCAxLjQ2MiAxMTMuMTAzOTc2LTE4LjIzMTk5Ni0yMS40OTc5OTUtMzEuNDE5OTkzLTQyLjc3MDk5MS00MS4yMDU5OTItNjYuMDYwOTg2LTE1LjU3Nzk5Ny0zNy4wNzM5OTItMjUuMTg1OTk1LTc1LjY4MTk4NC0yOS41OTc5OTMtMTE1LjY5Njk3NS0wLjg5LTguMDcwOTk4LTQuMDM3OTk5LTE2LjY1Mjk5Ni04LjUwNjk5OC0yMy40NTA5OTVDNDMuMzk5OTkxIDczMi41NTY5MTMgMTYuMTIzOTk3IDY2Mi41ODM5MjggNS4yMDM5OTkgNTg2LjYxMTk0NC0yLjI4IDUzNC41NTk5NTUtMS43MzkgNDgyLjQ5Nzk2NiA3LjEyOTk5OCA0MzAuMzMyOTc4IDMzLjcyODk5MyAyNzMuODg4MDExIDExNS43OTE5NzUgMTU0Ljk1OTAzNyAyNTAuMjk2OTQ2IDcyLjIzMDA1NCAzMTkuNjMwOTMxIDI5LjU4NzA2NCAzOTUuOTIwOTE1IDYuNzUzMDY5IDQ3Ny40NDM4OTcgMS4yMjkwN2M4OC4zNTk5ODEtNS45ODQ5OTkgMTcyLjM3Mjk2MyA5LjkxNzk5OCAyNTIuNzA0OTQ2IDQ2LjgwNTk5IDYuODE0OTk5IDMuMTI4OTk5IDE0Ljk5ODk5NyA0LjU1OTk5OSAyMi41NTU5OTUgNC41OTE5OTkgNTIuMzkzOTg5IDAuMjI4IDEwMi41OTE5NzggMTAuNzQwOTk4IDE1MC42NTY5NjggMzEuMjgyOTkzIDI0LjAzODk5NSAxMC4yNzQ5OTggNDEuNzcxOTkxIDI3LjkzMjk5NCA1NC44ODE5ODggNTAuNjA0OTg5ek0xODAuNzkyOTYxIDc4MS40MzY5MDJjLTMuNDMzOTk5IDE3LjQ3NTk5Ni03LjAyNjk5OCAzMi44ODk5OTMtOS4xOTk5OTggNDguNTAyOTktMC42ODMgNC45MDg5OTkgMC43NzcgMTIuMDE3OTk3IDQuMDcxOTk5IDE1LjI5NTk5NiA2MS44ODM5ODcgNjEuNTI0OTg3IDEzNS4yOTk5NzEgMTAzLjQ1Mzk3OCAyMjAuMTI5OTUzIDEyMy44OTU5NzQgNzYuNjE5OTg0IDE4LjQ2Mzk5NiAxNTMuNjc4OTY3IDE4LjMxMjk5NiAyMzAuMjUzOTUtMS43MTEgMTAwLjE1Nzk3OC0yNi4xOTA5OTQgMTgyLjk3ODk2MS03OS42MzA5ODMgMjQ4LjUzNjk0Ny0xNTkuNDQ0OTY2IDQwLjk1Nzk5MS00OS44NjU5ODkgNzAuMjc5OTg1LTEwNS45MTg5NzcgODguMjQyOTgxLTE2OC4wOTk5NjMgMTIuNzM5OTk3LTQ0LjEwMzk5MSAxOC41OTI5OTYtODkuMDMwOTgxIDE4LjM3Nzk5Ni0xMzQuNTk4OTcyLTAuMjItNDYuMzAwOTktNy41NjU5OTgtOTEuNjg3OTgtMjEuNjc4OTk1LTEzNi4wODU5Ny0zMy41NTY5OTMtMTA1LjU1Nzk3Ny05Ni43MTI5NzktMTg4Ljc2MTk1OS0xODguMTA5OTYtMjUwLjc5NDk0Ni00Ljk1MDk5OS0zLjM2MTk5OS0xMy4yNDE5OTctMy45MDU5OTktMTkuNTE0OTk2LTIuODk2LTQ3LjkwNTk5IDcuNjkzOTk4LTg5LjA5ODk4MSAzMS42MTk5OTMtMTMwLjcyMjk3MSA1NC42MjI5ODgtNDQuMjkyOTkgMjQuNDczOTk1LTgzLjQwNTk4MiA1Ni4wMDE5ODgtMTIyLjU0OTk3NCA4Ny41ODg5ODItNC4zNTQ5OTkgMy41MTg5OTktOS44NTQ5OTggNy4yMTE5OTgtMTUuMTM5OTk3IDcuNzUyOTk4LTY3Ljk2OTk4NSA2Ljk0ODk5OS0xMjIuMDQxOTc0IDM4LjEyNTk5Mi0xNjEuOTYzOTY1IDkzLjA2Mjk4LTEwLjkwMzk5OCAxNS4wMDc5OTctMTguNjQ1OTk2IDMyLjMwNDk5My0yOC4xNTg5OTQgNDkuMTE2OTg5aDQyNy42NDU5MDhjLTM0LjU0OTk5My04Mi44NzQ5ODItOTMuMzkwOTgtMTMwLjUwMDk3Mi0xODMuNzA1OTYtMTQyLjQ5MDk2OSA0LjI3Njk5OS0zLjIyODk5OSA2LjA3MDk5OS00LjYxMzk5OSA3Ljg5Njk5OC01Ljk1NDk5OSAyNS43NDk5OTQtMTguOTEzOTk2IDUwLjg1Mzk4OS0zOC43OTM5OTIgNzcuNDM3OTgzLTU2LjQ2MDk4OCAyNi44NzM5OTQtMTcuODU1OTk2IDU1LjEyNzk4OC0zMy42NjY5OTMgODIuOTc4OTgyLTUwLjAyNjk4OSA2LjQwNjk5OS0zLjc2MTk5OSAxMy4wOTQ5OTctNS40Njc5OTkgMjAuODQwOTk2LTAuODY2IDY5LjQ3MDk4NSA0MS4yODY5OTEgMTIwLjM0Nzk3NCA5OC44OTg5NzkgMTUzLjQ3ODk2NyAxNzIuNDAzOTYzIDI0LjM3Mzk5NSA1NC4wNzM5ODggMzcuMTU5OTkyIDExMS4wMjg5NzYgNDEuMjQzOTkxIDE2OS44ODY5NjQgMS42MjkgMjMuNDYxOTk1IDAuMjY4IDQ3LjEzMTk5IDAuMjY4IDczLjU5Nzk4NGgtNjM0LjkyOTg2NGMzLjk0ODk5OSA0Mi4wNDk5OTEgMTguMjE2OTk2IDc2LjkyNDk4MyA0My40MTM5OTEgMTA2LjY3Mjk3NyA0Ni40MDk5OSA1NC43OTY5ODggMTA4LjczNzk3NyA3NC45NzY5ODQgMTc3LjkzNzk2MiA3NS42OTk5ODQgNzEuODQ0OTg1IDAuNzUyIDEzNC43MDk5NzEtMjQuOTA5OTk1IDE4OC42NjY5NTktNzIuMDM1OTg1IDUuMTQ0OTk5LTQuNDkyOTk5IDguNTY2OTk4LTQuNTQ1OTk5IDE0LjI0OTk5Ny0xLjg0MDk5OSAzNC43MTQ5OTMgMTYuNTM3OTk2IDY5LjYyNTk4NSAzMi42NjA5OTMgMTA0LjQzOTk3OCA0OC45ODQ5ODkgMTcuNDUwOTk2IDguMTgxOTk4IDM0Ljg0Mjk5MyAxNi40OTE5OTYgNTMuMTQ0OTg4IDI1LjE2Nzk5NS0yLjQ0Mjk5OSA0LjI3MDk5OS00LjA0NDk5OSA3Ljc3MDk5OC02LjI1NDk5OCAxMC44Mjc5OTdDODExLjkwMzgyNiA4MzAuNjc2ODkyIDc0Ni45Mjk4NCA4ODAuNTcxODgxIDY2NC4xMDI4NTcgOTA0LjI5OTg3NmMtODIuODcwOTgyIDIzLjc0MDk5NS0xNjcuMDc4OTY0IDI3Ljg2NTk5NC0yNTIuMDU0OTQ2IDEwLjMwOTk5OC03OS44MzI5ODMtMTYuNDkyOTk2LTE1MC4yMDg5NjgtNTAuNTkwOTg5LTIwOC4xOTc5NTUtMTA4LjU2Mjk3Ny03LjM4Mzk5OC03LjM3OTk5OC0xNC4yOTU5OTctMTUuMjMwOTk3LTIzLjA1Njk5NS0yNC42MDk5OTV6IG0tODcuODEwOTgxLTQ5LjMxODk4OWMwLjgzMi01LjYxMzk5OSAxLjEyMi04LjU4ODk5OCAxLjcyNy0xMS40OTg5OTggNi4xNTI5OTktMjkuNjA4OTk0IDguMTMyOTk4LTYwLjkyMjk4NyAxOS4zMjM5OTYtODguNTAyOTgxIDM2Ljc1Nzk5Mi05MC41OTM5ODEgOTIuNjQyOTgtMTY5Ljg3MDk2NCAxNTQuMzE4OTY2LTI0NS4xOTc5NDcgMTIuMTgwOTk3LTE0Ljg3NTk5NyAyNC4zNDM5OTUtMjkuNzY0OTk0IDM2LjUxNDk5My00NC42NDg5OTEtMzAuNjUxOTkzIDE5LjU2MDk5Ni01OS41MjQ5ODcgNDEuMDYyOTkxLTgyLjc5MTk4MyA2OC44MzQ5ODYtMjMuMDA4OTk1IDI3LjQ2Njk5NC00Ni4yNjI5OSA1NC44ODM5ODgtNjcuMDgyOTg1IDgzLjk4MDk4Mi0yMC45MDQ5OTYgMjkuMjE1OTk0LTM4LjkzODk5MiA2MC40ODI5ODctNTguMjQ5OTg4IDkwLjg4MDk4LTAuNjA1LTMuMzU5OTk5LTEuNTEyLTcuNzQwOTk4LTIuMTc1OTk5LTEyLjE1ODk5Ny04LjY0OTk5OC01Ny42NDA5ODgtNi40MTQ5OTktMTE0LjY2Nzk3NSA3LjQyMDk5OC0xNzEuNDg3OTYzIDQyLjk2Nzk5MS0xNzYuNDQ5OTYyIDIwMi40MzE5NTctMzA1LjM5OTkzNCAzODQuNTk1OTE3LTMxMC4zNTY5MzQgMTYuMjgzOTk3LTAuNDQzIDMyLjk0Nzk5MyAwLjc5MSA0OC43NjE5OS0yLjI1Njk5OSAzMC41NTk5OTMtNS44ODg5OTkgNjAuNjEwOTg3LTE0LjM3Mjk5NyA5MC45Mjg5OC0yMS41NTg5OTYgOC44NzE5OTgtMi4xMDYgMTcuOTIxOTk2LTMuNDUzOTk5IDI5LjM2NDk5NC01LjYxNDk5OEM0OTEuOTgxODk0IDUuNTI5MDY5IDI3Ny4wNTM5NCA0Ny42NzAwNiAxNDIuMzM1OTY5IDIxMy4xMDAwMjQgNC43NTY5OTkgMzgyLjA0Nzk4OCAxNS45OTU5OTcgNTk5LjQzNDk0MSA5Mi45ODE5OCA3MzIuMTE3OTEzeiIgcC1pZD0iNDE4MiI+PC9wYXRoPjwvc3ZnPg==',
        url: 'https://www.so.com/s?q={q}',
    },
    'github.com': {
        name: 'GitHub',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTEyODI4ODYwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ5MDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDQyLjY2NjY2N0E0NjQuNjQgNDY0LjY0IDAgMCAwIDQyLjY2NjY2NyA1MDIuMTg2NjY3IDQ2MC4zNzMzMzMgNDYwLjM3MzMzMyAwIDAgMCAzNjMuNTIgOTM4LjY2NjY2N2MyMy40NjY2NjcgNC4yNjY2NjcgMzItOS44MTMzMzMgMzItMjIuMTg2NjY3di03OC4wOGMtMTMwLjU2IDI3LjczMzMzMy0xNTguMjkzMzMzLTYxLjQ0LTE1OC4yOTMzMzMtNjEuNDRhMTIyLjAyNjY2NyAxMjIuMDI2NjY3IDAgMCAwLTUyLjA1MzMzNC02Ny40MTMzMzNjLTQyLjY2NjY2Ny0yOC4xNiAzLjQxMzMzMy0yNy43MzMzMzMgMy40MTMzMzQtMjcuNzMzMzM0YTk4LjU2IDk4LjU2IDAgMCAxIDcxLjY4IDQ3LjM2IDEwMS4xMiAxMDEuMTIgMCAwIDAgMTM2LjUzMzMzMyAzNy45NzMzMzQgOTkuNDEzMzMzIDk5LjQxMzMzMyAwIDAgMSAyOS44NjY2NjctNjEuNDRjLTEwNC4xMDY2NjctMTEuNTItMjEzLjMzMzMzMy01MC43NzMzMzMtMjEzLjMzMzMzNC0yMjYuOTg2NjY3YTE3Ny4wNjY2NjcgMTc3LjA2NjY2NyAwIDAgMSA0Ny4zNi0xMjQuMTYgMTYxLjI4IDE2MS4yOCAwIDAgMSA0LjY5MzMzNC0xMjEuMTczMzMzczM5LjY4LTEyLjM3MzMzMyAxMjggNDYuOTMzMzMzYTQ1NS42OCA0NTUuNjggMCAwIDEgMjM0LjY2NjY2NiAwYzg5LjYtNTkuMzA2NjY3IDEyOC00Ni45MzMzMzMgMTI4LTQ2LjkzMzMzM2ExNjEuMjggMTYxLjI4IDAgMCAxIDQuNjkzMzM0IDEyMS4xNzMzMzNBMTc3LjA2NjY2NyAxNzcuMDY2NjY3IDAgMCAxIDgxMC42NjY2NjcgNDc3Ljg2NjY2N2MwIDE3Ni42NC0xMTAuMDggMjE1LjQ2NjY2Ny0yMTMuMzMzMzM0IDIyNi45ODY2NjZhMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDMyIDg1LjMzMzMzNHYxMjUuODY2NjY2YzAgMTQuOTMzMzMzIDguNTMzMzMzIDI2Ljg4IDMyIDIyLjE4NjY2N0E0NjAuOCA0NjAuOCAwIDAgMCA5ODEuMzMzMzMzIDUwMi4xODY2NjcgNDY0LjY0IDQ2NC42NCAwIDAgMCA1MTIgNDIuNjY2NjY3IiBwLWlkPSI0OTA0Ij48L3BhdGg+PC9zdmc+',
        url: 'https://github.com/search?q={q}',
    },
    'www.zhihu.com': {
        name: '知乎',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTEzMjMyOTgxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU3MjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzUxLjc5MTE4MiA1NjIuNDY5NDYybDE5Mi45NDU0MDcgMGMwLTQ1LjM2NzI1Ny0yMS4zODcxLTcxLjkzOTQ0OS0yMS4zODcxLTcxLjkzOTQ0OUwzNTUuODk3NzA5IDQ5MC41MzAwMTNjMy45Nzc1OTEtODIuMTgyNzQ0IDcuNTQxNzY3LTE4Ny42NTkwMDcgOC44MTY4MDYtMjI2LjgzNTI2MmwxNTkuMjgyNzI2IDBjMCAwLTAuODYzNjctNjcuNDAyMTA5LTE4LjU3ODEyNC02Ny40MDIxMDlzLTI3OS45Nzk2NDYgMC0yNzkuOTc5NjQ2IDAgMTYuODUwNzgzLTg4LjE0MTQ1NiAzOS4zMTg0OTQtMTI3LjA1MzY5OGMwIDAtODMuNjA1MTQtNC41MTA3MzQtMTEyLjEyMTYxNCAxMDYuOTYyMTA0UzgxLjM0NDY1NiAzNTUuMDc3MDE4IDc2LjgwODM0IDM2Ny4zOTA0NjFjLTQuNTM2MzE2IDEyLjMxMzQ0MyAyNC42Mjc5MSA1LjgzMjg0NSAzNi45NDEzNTQgMCAxMi4zMTM0NDMtNS44MzI4NDUgNjguMDUwODg1LTI1LjkyNDQzOSA4NC4yNTI4OTMtMTAzLjY5NTcxbDg2LjU3MDY4MSAwYzEuMTY1NTQ2IDQ5LjI4NjUyIDQuNTk2NjkxIDIwMC4zMzU3MjQgMy41MTUwNTcgMjI2LjgzNTI2MkwxMDkuODYxMTMgNDkwLjUzMDAxM2MtMjUuMjc1NjYzIDE4LjE0NzMxMi0zMy43MDE1NjYgNzEuOTM5NDQ5LTMzLjcwMTU2NiA3MS45Mzk0NDlMMjc5Ljg2ODEwNSA1NjIuNDY5NDYyYy04LjQ5NzUzNSA1Ni4yNTUyMzUtMjMuNDE3MzM5IDEyOC43NjM2NDItNDQuMjc1Mzg5IDE2Ny4yMTAyNzktMzMuMDUyNzkgNjAuOTIxNTExLTUwLjU1MjM1IDExNi42NTc5My0xNjkuODAyMzE0IDIxMi41NzY1MTMgMCAwLTE5LjQ0MjgxOCAxNC4yNTc3MjUgNDAuODI5OTE3IDkuMDczNjU2IDYwLjI3Mzc1OC01LjE4NTA5MyAxMTcuMzA1NjgzLTIwLjczOTM0NyAxNTYuODQwMDk0LTk5LjgwNzE0NyAyMC41NTMxMDUtNDEuMTA3MjMzIDQxLjgwNTEyOC05My4yNTA4MjQgNTguMzg2NzgyLTE0Ni4xMzgzNThsLTAuMDU1MjU5IDAuMTg1MjE4IDE2Ny44NTU5ODYgMTkzLjI2MzY1NWMwIDAgMjIuMDM1ODc2LTUxLjg0Nzg1NSA1LjgzMjg0NS0xMDguODgwODAzTDM3MS4wNDU3MTEgNjUwLjYxMDkxOGwtNDIuMTI0NCAzMS4xNTc2MjctMC4wNDUwMjUgMC4xNTE0NDljMTEuNjk5NDYtNDEuMDIwMjUyIDIwLjExMjA2LTgxLjU3NDkgMjIuNzI2NjA3LTExNi44NTg0OThDMzUxLjY2NTMxNSA1NjQuMjEyMTUyIDM1MS43Mjg3NiA1NjMuMzQ1NDEyIDM1MS43OTExODIgNTYyLjQ2OTQ2MnoiIHAtaWQ9IjU3MjgiPjwvcGF0aD48cGF0aCBkPSJNNTg0LjkxODc1MyAxODIuMDMzODkzbDAgNjY4Ljg0MDA5NCA3MC4zMTg1MzIgMCAyOC44MDcwOTMgODAuNTEyNzA4IDEyMS44NzU3NjgtODAuNTEyNzA4IDE1My42MDAzMDcgMEw5NTkuNTIwNDUzIDE4Mi4wMzM4OTMgNTg0LjkxODc1MyAxODIuMDMzODkzek04ODcuMTUwMTkyIDc3OC45MzQ1MzhsLTc5LjgzNzMyNiAwLTk5LjU3ODk0OSA2NS43ODIyMTYtMjMuNTM3MDY2LTY1Ljc4MjIxNi0yNC44NTUwODQgMEw2NTkuMzQxNzY2IDI1Ni42NzM4NDdsMjI3LjgwNzQwMyAwTDg4Ny4xNDkxNjkgNzc4LjkzNDUzOHoiIHAtaWQ9IjU3MjkiPjwvcGF0aD48L3N2Zz4=',
        url: 'https://www.zhihu.com/search?q={q}',
    },
    'search.bilibili.com': {
        name: 'bilibili',
        icon: 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY4MTE0NTk2MjgyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijc4NiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik00MDYuNzU2Mjk4NTMgMjgxLjM3NzIxNTE1Yy0xOS45Mjc4MDExNy0xMC43OTQyMjUyMS0zOS44NTU2MDIzNS0yMS41ODg0NTE1NS01OS43ODM0MDM1Mi0zMi41MjEwNjQ2OGwtOTkuMjIzODQ0NDItNTMuOTcxMTI5NDZjLTEzLjQyMzU4ODY5LTcuMzM0NTM3NjctMTguOTU5MDg5MjEtMTguNTQzOTI2NjEtMTEuMzQ3Nzc1NzEtMzIuMzgyNjc2NzYgNy42MTEzMTM0OS0xMy45NzcxMzgwNiAyMC4zNDI5NjM3Ny0xNC45NDU4NTExNyAzMy40ODk3NzY2NC03Ljc0OTcwMDI3IDc3LjQ5NzAwNDk0IDQyLjIwODE5MDAxIDE1NS4xMzIzOTg5MyA4NC4yNzc5OTMyNSAyMzIuNDkxMDE3MSAxMjcuMDM5NzMzNzYgMTkuNzg5NDE0NCAxMC45MzI2MTMxMiA1NS40OTMzOTE5MyA0LjQyODQwMDY0IDY4LjA4NjY1NDI5LTE0LjExNTUyNTk3IDM5LjU3ODgyNzY2LTU3LjQzMDgxNjk5IDc5LjAxOTI2ODU1LTExNC44NjE2MzI4NSAxMTguNDU5NzA4MzEtMTcyLjQzMDgzNzc2IDEuMzgzODc0NTYtMi4wNzU4MTI5OCAyLjc2Nzc1MDI2LTQuMTUxNjI0ODIgNC4xNTE2MjQ4MS02LjA4OTA0OTg4IDExLjIwOTM4NzgxLTE1LjYzNzc4ODQ1IDI0LjA3OTQyNzEzLTE5Ljc4OTQxNDQgMzUuNzAzOTc3NTQtMTAuNjU1ODM4NDQgMTMuNDIzNTg4NjkgMTAuNjU1ODM4NDMgMTEuMjA5Mzg3ODEgMjMuMjQ5MTAxOTQgMi40OTA5NzU1NyAzNS45ODA3NTIyMS0xNi4wNTI5NTEwNCAyMy4zODc0ODg3MS0zMi4xMDU5MDIwOCA0Ni45MTMzNjUzMy00OC4wMjA0NjYzNSA3MC4zMDA4NTUxOS0yMi4xNDIwMDIwNiAzMi41MjEwNjQ2Ny00NC4yODQwMDI5OSA2NS4wNDIxMjkzNS02OS4wNTUzNjc0IDEwMS4xNjEyNjk0N0g4OTMuMDUwMDA4NDZjMjYuMDE2ODUyMTkgMCAzMC4wMzAwODkxIDQuMTUxNjI0ODIgMzAuMTY4NDc3MDEgMzAuMTY4NDc3MDEgMC4yNzY3NzQ2OSAxNzguMzgxNDk5NzMgMC40MTUxNjI1OSAzNTYuNjI0NjEyNjkgMC42OTE5MzcyOCA1MzUuMDA2MTEzNTcgMCAyNS40NjMzMDE2OS00LjU2Njc4NzQxIDI5Ljg5MTcwMjMzLTMwLjU4MzYzOTYgMzAuMDMwMDg5MS02Ljc4MDk4ODMgMC0xMy43MDAzNjMzOCAwLjY5MTkzNzI4LTIwLjM0Mjk2Mzc3LTAuMTM4Mzg3OTEtMjQuNjMyOTc2NS0yLjc2Nzc1MDI2LTQyLjYyMzM1MjYxLTAuNDE1MTYyNTktNTEuMjAzMzc5MiAzMC4wMzAwOTAyNC03Ljc0OTcwMDI3IDI3LjQwMDcyNjc1LTM2Ljk0OTQ2NTMxIDQxLjM3Nzg2NTk1LTYzLjI0MzA5MTA2IDM4LjYxMDExNDU2LTMwLjQ0NTI1MTctMy4xODI5MTI4NS01MC41MTE0NDA3OC0yMS4xNzMyODg5Ni01OC4yNjExNDIxOS00OS41NDI3Mjc2OC00LjcwNTE3NTMzLTE3LjE2MDA1MDkxLTEyLjczMTY1MTQxLTE5LjUxMjYzODU4LTI4LjIzMTA1MTk0LTE5LjM3NDI1MTgtMTA2Ljk3MzU0NDY3IDAuNjkxOTM3MjgtMjEzLjgwODcwMjU4IDAuNDE1MTYyNTktMzIwLjc4MjI0NzI2IDAuMTM4Mzg3OS0xMi4zMTY0ODg4MiAwLTE5LjUxMjYzODU4IDEuMTA3MDk5ODctMjMuMTEwNzE0MDIgMTYuMDUyOTUxMDQtNy43NDk3MDAyNyAzMi4xMDU5MDIwOC0zNC4xODE3MTUwNiA1Mi40NDg4NjU4NS02My4zODE0ODAxMSA1My4wMDI0MTYzNi0zMC4zMDY4NjQ5MyAwLjU1MzU1MDUxLTU2LjYwMDQ5MTgxLTE5LjIzNTg2Mzg5LTY1LjQ1NzI5MTk1LTUyLjU4NzI1Mzc2LTMuNzM2NDYyMjItMTMuOTc3MTM4MDYtOS45NjM5MDExNS0xNy4xNjAwNTA5MS0yMi44MzM5MzkzNC0xNi40NjgxMTM2NC0xNi42MDY1MDE1NSAwLjk2ODcxMzEtMzMuMzUxMzg5ODcgMC40MTUxNjI1OS01MC4wOTYyNzgxOCAwLjEzODM4Njc4LTE4LjI2NzE1MDc5LTAuNDE1MTYyNTktMjYuMjkzNjI2ODgtNy44ODgwODgxOC0yNi4yOTM2MjY4OC0yNS43NDAwNzYzOCAwLjEzODM4NzkxLTE4MS4yODc2Mzc5IDAuNDE1MTYyNTktMzYyLjcxMzY2MjU4IDAuODMwMzI1MTgtNTQ0LjEzOTY4ODM4IDAtMTguODIwNzAxMyA3LjYxMTMxMzQ5LTI1LjA0ODEzOTA5IDI4LjUwNzgyNjY0LTI1LjA0ODEzOTEgODUuOTM4NjQzNjMtMC4xMzgzODc5MSAxNzEuODc3Mjg3MjUgMCAyNTcuNjc3NTQyOTYgMGgxNy45OTAzNzcyNWMwLjU1MzU1MDUxLTEuNTIyMjYyNDcgMS4xMDcwOTk4Ny0zLjA0NDUyNDk0IDEuNjYwNjQ5MjUtNC43MDUxNzUzMnogbTQ3NS4wODQzMjA5OSA1NTcuODQwMDUxNzZWMzI2LjYyOTkzMTIzSDE0NC4wOTY4MDU1NXY1MTIuNTg3MzM1NjhoNzM3Ljc0MzgxMzk3eiBtLTU5Mi43MTM3MDQxMSA0My4xNzY5MDMxMkgyMzguMzM4Njk5OTVjMy40NTk2ODc1NCAxNC41MzA2ODg1NyAxMC41MTc0NTA1MyAyNC43NzEzNjQ0MSAyNC4wNzk0MjU5OSAyNS42MDE2ODk2IDE1LjA4NDIzOTA3IDEuMTA3MDk5ODcgMjIuMjgwMzg4ODMtMTAuMTAyMjg3OTMgMjYuNzA4Nzg5NDctMjUuNjAxNjg5NnogbTQ0OC43OTA2OTQxMi0wLjEzODM4NzkyYzUuMTIwMzM3OTIgMTUuNDk5NDAwNTMgMTIuMDM5NzEyOTkgMjYuODQ3MTc3MzkgMjcuMjYyMzM5OTggMjUuNzQwMDc3NTIgMTMuNzAwMzYzMzgtMC45Njg3MTMxIDIwLjA2NjE4OTA5LTExLjYyNDU1MDQgMjQuMjE3ODEzOS0yNS43NDAwNzc1MmgtNTEuNDgwMTUzODh6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSI3ODciPjwvcGF0aD48cGF0aCBkPSJNNTEzLjU5MTQ1NjQzIDgwMy45Mjg0NTE5OEgyMTcuMDI3MDIzMDdjLTI4Ljc4NDYwMjQ1IDAtMzMuMzUxMzg5ODctNC41NjY3ODc0MS0zMy4zNTEzODk4Ni0zMy4zNTEzODk4NyAwLjEzODM4NzkxLTEyMy45OTUyMDg4MiAwLjI3Njc3NDY5LTI0Ny45OTA0MTc2MyAwLjU1MzU1MDUtMzcyLjEyNDAxNDM2IDAtMjYuMTU1MjM4OTcgNS4zOTcxMTI2MS0zMS41NTIzNTI3MSAzMS40MTM5NjM2Ny0zMS41NTIzNTE1N2g1OTUuMDY2MjkyOTFjMjYuNDMyMDE0NzkgMCAzMS44MjkxMjczOSA1LjI1ODcyNTgzIDMxLjk2NzUxNDE2IDMxLjEzNzE5MDExIDAuNDE1MTYyNTkgMTI0LjY4NzE0NjEgMC42OTE5MzcyOCAyNDkuMjM1OTA1NDIgMC44MzAzMjUyIDM3My45MjMwNTAzOCAwIDI2LjcwODc4OTQ3LTUuNTM1NTAwNTEgMzEuODI5MTI3MzktMzMuMDc0NjE1MTkgMzEuOTY3NTE1MzFINTEzLjU5MTQ1NjQzeiBtMjg1LjIxNjY1NzYzLTQzLjg2ODg0MDM5VjQxMS4xODQ2OTkxN0gyMjcuODIxMjQ4Mjl2MzQ4Ljg3NDkxMjQyaDU3MC45ODY4NjU3N3oiIGZpbGw9IiMwMDAwMDAiIHAtaWQ9Ijc4OCI+PC9wYXRoPjxwYXRoIGQ9Ik01MTYuMjIwODE4NzcgNjk4LjIwMDM5Mzk1Yy03LjYxMTMxMzQ5IDUuMzk3MTEyNjEtMTQuNjY5MDc2NDggMTEuNDg2MTYzNjMtMjIuNjk1NTUxNDMgMTUuNzc2MTc2MzYtMjYuNDMyMDE0NzkgMTMuOTc3MTM4MDYtNTIuNzI1NjQxNjcgMTIuNzMxNjUxNDEtNzcuMDgxODQyMzUtNC4yOTAwMTI3My0yNi44NDcxNzczOS0xOC44MjA3MDEzLTM4Ljc0ODUwMjQ3LTQ2LjM1OTgxNTk3LTM2LjM5NTkxNTk0LTc4LjQ2NTcxODA0IDAuNTUzNTUwNTEtNi45MTkzNzUwNyAxMy4yODUyMDA3OC0xNy44NTE5ODgxOSAyMC42MTk3Mzk1OS0xOC4xMjg3NjQwMiA3LjE5NjE1MDktMC4yNzY3NzQ2OSAxNi4zMjk3MjU3MyA5LjY4NzEyNTMzIDIxLjU4ODQ1MTU1IDE3LjI5ODQzODgzIDQuMTUxNjI0ODIgNi4wODkwNDk4OSAyLjM1MjU4NzY2IDE1Ljc3NjE3NjM1IDUuMjU4NzI0NyAyMy4xMTA3MTQwMiA1LjUzNTUwMDUxIDEzLjk3NzEzODA2IDE1Ljc3NjE3NjM1IDI3LjI2MjMzOTk4IDMxLjEzNzE5MDEyIDIzLjk0MTAzOTIyIDExLjM0Nzc3NTcxLTIuMzUyNTg3NjYgMjEuNTg4NDUxNTUtMTMuODM4NzUxMjkgMzAuMDMwMDg5MS0yMy4yNDkxMDA4IDQuMTUxNjI0ODItNC43MDUxNzUzMyAzLjQ1OTY4NzU0LTEzLjk3NzEzODA2IDQuNTY2Nzg4NTUtMjEuMTczMjkwMSAxLjkzNzQyNTA3LTEzLjcwMDM2MzM4IDkuODI1NTEzMjUtMjIuMDAzNjE0MTUgMjMuMjQ5MTAxOTMtMjEuNzI2ODM4MzIgMTIuMTc4MTAwOTEgMC4yNzY3NzQ2OSAyMC4wNjYxODkwOSA3Ljc0OTcwMDI3IDIxLjcyNjgzODM0IDIxLjAzNDkwMTA0IDAuOTY4NzEzMSA4LjQ0MTYzNzU1IDEuMjQ1NDg3NzkgMTguOTU5MDg5MjEgNi4yMjc0Mzc3OSAyNC40OTQ1ODk3MyA4LjAyNjQ3NjA5IDguOTk1MTg4MDUgMTkuMzc0MjUxODEgMTkuNzg5NDE0NCAyOS43NTMzMTQ0MiAyMC4yMDQ1NzU4NSA5LjI3MTk2Mjc0IDAuMjc2Nzc0NjkgMjAuNjE5NzM4NDUtMTEuMDcxMDAxMDMgMjcuOTU0Mjc3MjYtMTkuOTI3ODAxMTcgNC44NDM1NjMyMy01LjgxMjI3NTIgNC41NjY3ODc0MS0xNi4xOTEzMzg5NSA2LjA4OTA1MTAyLTI0LjYzMjk3NjQ5IDIuNDkwOTc1NTctMTMuNDIzNTg4NjkgMTAuMTAyMjg3OTMtMjEuNTg4NDUxNTUgMjMuOTQxMDM5MjItMjAuNjE5NzM5NiAxMy43MDAzNjMzOCAxLjEwNzA5OTg3IDIwLjg5NjUxNDI3IDkuOTYzOTAxMTUgMjAuMzQyOTYzNzcgMjMuOTQxMDM5MjItMS4zODM4NzQ1NiAzNS4yODg4MTQ5My0xNS4yMjI2MjU4NSA2My45MzUwMjk0Ny00Ny44ODIwNzg0NCA3OS43MTEyMDU4My0zMC40NDUyNTE3IDE0LjY2OTA3NjQ4LTU4Ljk1MzA3OTQ3IDguNDQxNjM3NTUtODMuODYyODMwNjQtMTQuMjUzOTEyNzUtMS4zODM4NzQ1Ni0wLjk2ODcxMzEtMi45MDYxMzgxNy0xLjc5OTAzNzE1LTQuNTY2Nzg4NTYtMy4wNDQ1MjYwOHpNNzU5Ljc4MjgzNTc3IDU2Ni4xNzg3MTAxOWMwLjQxNTE2MjU5IDIwLjg5NjUxNDI3LTE2LjYwNjUwMTU1IDMyLjM4MjY3Njc3LTMyLjM4MjY3Njc2IDIzLjM4NzQ4ODcxLTQyLjIwODE5MDAxLTI0LjA3OTQyNzEzLTgzLjcyNDQ0Mzg3LTQ5LjQwNDM0MDkxLTEyNS4xMDIzMDg3LTc0Ljg2NzY0MjYtMTAuOTMyNjEzMTItNi43ODA5ODgzLTEzLjI4NTIwMDc4LTE3Ljg1MTk4ODE5LTYuOTE5Mzc2MjEtMjkuMDYxMzc3MTMgNi41MDQyMTI0OC0xMS40ODYxNjM2MyAxNy45OTAzNzYxMS0xNC41MzA2ODg1NyAyOC42NDYyMTQ1NC04LjQ0MTYzNzU1IDQyLjYyMzM1MjYxIDI0LjYzMjk3NjUgODQuODMxNTQzNzUgNDkuOTU3ODkxNDEgMTI2Ljc2Mjk1OTA3IDc1LjgzNjM1NDU2IDQuODQzNTYzMjMgMy4xODI5MTI4NSA3LjE5NjE1MDkgMTAuNTE3NDUwNTMgOC45OTUxODgwNiAxMy4xNDY4MTQwMXpNMzk5LjU2MDE0ODc3IDQ4NS43NzU1NjcwN2MzLjg3NDg1MDEzIDMuODc0ODUwMTMgMTMuODM4NzUxMjkgOS4yNzE5NjI3NCAxNC45NDU4NTExNiAxNS45MTQ1NjMxNCAxLjI0NTQ4Nzc5IDcuODg4MDg4MTgtMi45MDYxMzgxNyAyMS41ODg0NTE1NS04Ljk5NTE4OTE5IDI0LjYzMjk3NjQ5LTM2LjY3MjY5MDYzIDE4LjgyMDcwMTMtNzQuMzE0MDkzMjMgMzUuNzAzOTc3NTMtMTEyLjA5Mzg4MjYgNTIuNDQ4ODY2OTktMTEuNDg2MTYzNjMgNS4xMjAzMzc5Mi0yNC4wNzk0MjcxMyAxLjI0NTQ4Nzc5LTI2Ljk4NTU2NDE2LTExLjIwOTM4ODk0LTEuOTM3NDI1MDctOC4xNjQ4NjI4NiAxLjUyMjI2MjQ3LTIzLjUyNTg3NjYyIDcuMzM0NTM3NjctMjYuNTcwNDAxNTcgMzcuNzc5NzkwNTEtMTkuMzc0MjUxODEgNzYuODA1MDY3NjYtMzYuMTE5MTQwMTMgMTE1LjQxNTE4MzM2LTUzLjY5NDM1MzYzIDEuNjYwNjUwMzgtMC42OTE5MzcyOCAzLjU5ODA3NTQ1LTAuNTUzNTUwNTEgMTAuMzc5MDYzNzYtMS41MjIyNjI0OHoiIGZpbGw9IiMwMDAwMDAiIHAtaWQ9Ijc4OSI+PC9wYXRoPjwvc3ZnPg==',
        url: 'https://search.bilibili.com/all?keyword={q}',
    },
};

var configCached = GM_getValue('config', config);
GM_setValue('config', configCached);
var setting = Object.assign(config.default, configCached.default, configCached[location.host]);
engines = GM_getValue('sites', engines);
GM_setValue('sites', engines);

function appendStyles() {
    var isLeft = setting.position === 'left';
    var offsetSignal = isLeft ? '-' : '';
    GM_addStyle(`
#sc-panel {
  position: fixed;
  ${setting.position}: ${setting.peekSize}px;
  top: ${setting.top};
  padding: 0 20px 0 60px;
  transform: translate(${offsetSignal}100%, -50%);
  transition: all .2s;
  height: ${setting.height}px;
  border-radius: ${setting.height / 2}px;
  opacity: .6;
  background: red;
  z-index: ${setting.zIndex};

  display: flex;
  flex-direction: row;
  align-items: stretch;
}

#sc-panel.active {
  transform: translate(${offsetSignal}${setting.peekSize * 2}px, -50%);
  box-shadow: 0 0 10px rgba(255, 0, 0, .4);
  opacity: 1;
}

#sc-panel-triggle {
  position: absolute;
  left: -${isLeft ? 0 : setting.triggleHor};
  right: -${isLeft ? setting.triggleHor : 0};
  top: -${setting.triggleVer};
  bottom: -${setting.triggleVer};
  z-index: ${setting.zIndex - 1};
}

#sc-panel .sc-panel-item {
  position: relative;
  z-index: ${setting.zIndex + 1};
  color: white;
  font-size: 12px;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  padding: 0 10px;
  transition: background .3s;
}

#sc-panel .sc-panel-item:hover {
  background: rgba(255, 255, 255, .2);
}

#sc-panel .sc-panel-item img {
  width: 24px;
  filter: invert(1);
  margin-bottom: 2px;
}
    `);
}

function appendElement() {
    var body = document.body;
    if (!body) return;

    var panel = document.createElement('div');
    panel.id = 'sc-panel';
    // panel.className = 'active';

    // panel triggle
    var triggle = document.createElement('div');
    var timerEnter = null;
    var timerLeave = null;
    var funcEnter = () => addClassName(panel, 'active');
    var funcLeave = () => removeClassName(panel, 'active');
    triggle.id = 'sc-panel-triggle';
    panel.onmouseenter = () => {
        clearTimeout(timerLeave);
        timerEnter = setTimeout(funcEnter, setting.delayEnter);
    }
    panel.onmouseleave = () => {
        clearTimeout(timerEnter);
        timerLeave = setTimeout(funcLeave, setting.delayLeave);
    }
    panel.appendChild(triggle);

    // engines
    Object.entries(engines).forEach(entry => {
        var key = entry[0];
        if (key === location.host) return;
        var engine = entry[1];
        var ele = document.createElement('a');
        ele.className = 'sc-panel-item';
        ele.setAttribute('href', engine.url.replace(/\{q\}/, queryParam()));
        var img = document.createElement('img');
        img.setAttribute('src', `data:image/svg+xml;base64,${engine.icon}`);
        ele.appendChild(img);
        var name = document.createElement('span');
        name.innerText = engine.name;
        ele.appendChild(name);
        panel.appendChild(ele);
    });

    body.appendChild(panel);
}

function addClassName(ele, name) {
    var classes = (ele.className || '').split(' ').filter(it => it);
    if (!classes.includes(name)) {
        classes.push(name);
    }
    ele.className = classes.join(' ');
}

function removeClassName(ele, name) {
    var classes = (ele.className || '').split(' ').filter(it => it && it !== name);
    ele.className = classes.join(' ');
}

function queryParam() {
    var current = engines[location.host];
    if (!current) return '';
    var key = current.url.match(/[\d\w]+(?=\=\{q\})/)[0];
    return location.search.match(RegExp(`(?<=${key}\=).*?(?:$|(?=&))`))[0];
}

(function() {
    'use strict';

    appendStyles();
    appendElement();
})();
