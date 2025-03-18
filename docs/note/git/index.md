---
title: Git
---

# Git

<ImagePreview src="/images/git/image.png"></ImagePreview>

## git fetch

git fetch 命令只会将数据下载到你的本地仓库——它并不会自动合并或修改你当前的工作。 当准备好时你必须手动将其合并入你的工作。所以用 vscode 工具查看远程分支的时候，先 git fetch 一下，就可以将最新远程的所有分支下到本地进行切换分支

## git pull

两者的用法十分相似，pull 用法如下：

```

git pull <远程主机名> <远程分支名>:<本地分支名>
```

例如将远程主机 origin 的 master 分支拉取过来，与本地的 branchtest 分支合并，命令如下：

```
git pull origin master:branchtest
```

同样如果上述没有冒号，则表示将远程 origin 仓库的 master 分支拉取下来与本地当前分支合并

## git pull --rebase

当你希望将远程仓库的最新更改合并到你的本地分支，并且希望你的本地提交能够按照时间顺序排列在远程分支的顶部，不产生的<span style='color: red'>额外合并提交（merge commit）</span>，使提交历史更加简洁可以使用 `git pull --rebase`

## git stash

stash 命令能够将还未 commit 的代码存起来

### 应用场景

当你的开发进行到一半,但是代码还不想进行提交 ,然后需要同步去关联远端代码时.如果你本地的代码和远端代码没有冲突时,可以直接通过 git pull 解决

但是如果可能发生冲突怎么办.直接 git pull 会拒绝覆盖当前的修改，这时候就可以依次使用下述的命令：

```
git stash
git pull
git stash pop
```

或者当你开发到一半，现在要修改别的分支问题的时候，你也可以使用 git stash 缓存当前区域的代码

```
git stash：保存开发到一半的代码
git checkout XX分支：切换别的分支修改代码
git pull：别的分至修改完后提交代码
git checkout XX分支：切换到stash分支上
git stash pop：将代码追加到最新的提交之后

```

### git stash apply

应用最近一次的 stash

### git stash pop

应用最近一次的 stash，随后删除该记录

### git stash drop

删除最近的一次 stash

### git stash clear

删除 stash 的所有记录

### git stash list

当有多条 stash，可以指定操作 stash，首先使用 stash list 列出所有记录：

```
$ git stash list
stash@{0}: WIP on ...
stash@{1}: WIP on ...
stash@{2}: On ...
```

应用第二条记录

```

$ git stash apply stash@{1}
```

pop，drop 同理。

关于提交信息的格式，可以遵循以下的规则：

- feat: 新特性，添加功能
- fix: 修改 bug
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理

## 项目中 git 流程

以 GitHub 中的项目为例，找到项目复制出克隆地址

<ImagePreview src="/images/git/image18.jpg"></ImagePreview>

1. 在终端输入 `git clone https://xxx(复制的地址)`

2. 安装项目中依赖 `npm install`

3. 创建本地仓库分支：`git checkout -b 分支名 `来进行修改代码，或者在 vscode 中来进行创建分支

   <ImagePreview src="/images/git/image20.jpg"></ImagePreview>

4. 修完完代码， `git add.` 提交暂存区，或者在 vscode 中来进行添加

   <ImagePreview src="/images/git/image21.jpg"></ImagePreview>

5. `git commit -m “注释” ` 将暂存区文件提交到版本库, 如果有 eslint 校验失败项目中又没有强制规定，可`git commit --no-verify -m "commit" ` 就可以跳过代码检查，可以在 vscode 中这样提交

   <ImagePreview src="/images/git/image22.jpg"></ImagePreview>

6. `git push` 提交代码

   <ImagePreview src="/images/git/image19.jpg"></ImagePreview>

7. 此时你可以看到控制台会有`git push --set-upstream origin xxx分支`意思是：当前分支没有与远程分支关联，导致了提交代码失败。
8. 此时有两种关联方式
   1. 一种暴力方式`git push origin xxx分支` 推向制定的分支，用此方式再次提交代码时每次都得 origin 远程分支。
   2. 第二种复制`git push --set-upstream origin xxx分支`到控制台回车，代码提交完成，这样关联有一个好处，第二次提交代码只需`git push`就可以提交代码
9. 如果此分支还需要更改代码，则再从第四步继续执行。

## 合并 commit

commit 合并流程：在本地提了好多 commit，最终合并成一个 commit

### 查看 commit

`git log` 查看一下 commit

<ImagePreview src="/images/git/image23.jpg"></ImagePreview>

或者执行 `git log --oneline`查看简介版本

<ImagePreview src="/images/git/image24.jpg"></ImagePreview>

键盘 `q` 退出 `git log`

### 执行 rebase

要选择一个 commitID , 比如我想要合并最近的三条 commit 为一个 commit，那我就得复制第四条的 commit，那就是 aa96ade，执行`git rebase -i aa96ade`

<ImagePreview src="/images/git/image26.jpg"></ImagePreview>

按键盘 `i`进行编辑页面 ，将不要的 commit 用 `s`进行修改掉

要保留一个 pick 一般把第一个 pick 保留

修改成如下所示: 意思就是把下面 2 个 commit 提交 和 第一个 commit 合并在一起

<ImagePreview src="/images/git/image25.jpg"></ImagePreview>

然后按 `esc` 退出，然后按`:wq` 回车进行保存，得到如下界面

<ImagePreview src="/images/git/image27.jpg"></ImagePreview>

按键盘 `i` 进行编辑页面，将不要的 commit 用`#`进行注释掉

<ImagePreview src="/images/git/image29.jpg"></ImagePreview>

然后 `esc`退出，然后按`:wq` 回车进行保存

### 验证 commit

再次输入 `git log` 验证 commit 记录时候是我们想要的两条

<ImagePreview src="/images/git/image30.jpg"></ImagePreview>

### 推入远程仓库

然后进行 `git push -f`，在远程上查看 commit 是否合入成功，然后在进行 merge request

## .gitignore（忽略文件）

这个文件是用来指定哪些文件不被纳入 git 管理的。git commit 不会提交这些文件。

这个文件不是自动生成的，需要你手动创建并编写规则。

一些常见的例子：

1. vscode 自动创建的.vscode 文件
2. 前端安装依赖生成的巨大的 node_modules 文件夹
3. Electron 打包生成的 build 文件夹
4. 一些不想上传的文件，例如密码配置文件之类。
5. ......

### 例子

<ImagePreview src="/images/git/image28.jpg"></ImagePreview>

### 匹配规则

可以看到我们排除掉的目录都是以置灰的状态展示

<ImagePreview src="/images/git/image31.jpg"></ImagePreview>

| 表达式        | 说明                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| \*.txt        | 忽略所有 .txt 后缀的文件                                                     |
| !src.a        | 忽略除 src.a 外的其他文件                                                    |
| /todo         | 仅忽略项目根目录下的 todo 文件，不包括 src/todo                              |
| build/        | 忽略 build/目录下的所有文件，过滤整个 build 文件夹；                         |
| doc/\*.txt    | 忽略 doc 目录下所有 .txt 后缀的文件，但不包括 doc 子目录的 .txt 的文件       |
| bin/:         | 忽略当前路径下的 bin 文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件 |
| /bin:         | 忽略根目录下的 bin 文件                                                      |
| /\_.c:        | 忽略 cat.c，不忽略 build/cat.c                                               |
| debug/\_.obj: | 忽略 debug/io.obj，不忽略 debug/common/io.obj 和 tools/debug/io.obj          |
| \*\*/foo:     | 忽略/foo, a/foo, a/b/foo 等                                                  |
| a/\*\*/b:     | 忽略 a/b, a/x/b, a/x/y/b 等                                                  |
| !/bin/run.sh  | 不忽略 bin 目录下的 run.sh 文件                                              |
| \*.log:       | 忽略所有 .log 文件                                                           |
| config.js:    | 忽略当前路径的 config.js 文件                                                |
| /mtk/         | 忽略整个文件夹                                                               |
| \*.zip        | 忽略所有.zip 文件                                                            |
| /mtk/do.c     | 忽略某个具体文件                                                             |
| dist          | 忽略所有 dist 目录 或文件                                                    |

### 配置不生效

在填写忽略文件的过程中，我发现.gitignore 中已经标明忽略的文件目录下的文件，当我想 git push 的时候还会出现在 push 的目录中，原因是因为 git 忽略目录中，新建的文件在 git 中会有缓存，如果某些文件已经被纳入了版本管理中，就算是在.gitignore 中已经声明了忽略路径也是不起作用的，这时候我们就应该先把本地缓存删除，然后再进行 git push，这样就不会出现忽略的文件了。git 清除本地缓存命令如下：

```js
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

<BackTop></BackTop>