---
title: |
  Using GitPod
header-includes: |
  ```{=html}
  <style>
  div#agreement img {
    border: solid 0.5pt hsl(0 0% 80% / 0.5);
  }
  </style>
  ```  
---

[gitpod]: https://gitpod.io/
[vs-code]: https://code.visualstudio.com

If you don't yet have access to a laptop on which you
can install VirtualBox and Vagrant, then for the first couple of
labs you can also use
a cloud-based development VM provided by [GitPod][gitpod].

You should complete the following steps:

1.  You'll need to have a GitHub account for this, so if you don't have
    one already, visit <https://github.com/> and create one.

#.  Log into your GitHub account. Once that's done, paste the following URL into your browser:

    &nbsp; <https://gitpod.io/#https://github.com/cits3007/ubuntu-gitpod>
    
    You'll be prompted to use GitHub to access GitPod:
    
    `<div id="agreement" style="display: flex; justify-content: center;">`{=html}
    ![](images/gitpod-agreement.png "gitpod agreement")
    `</div>`{=html}
    
#.  Click "Continue with GitHub".
    
    GitPod will start a cloud-based virtual machine in which the standard
    CITS3007 environment is available, and the latest version of
    [Visual Studio Code][vs-code] (VS Code) editor is running:
   


    ![](images/gitpod-env.png "gitpod environment")

    </div>
    
    Initially, VS Code will start with the folder `/workspace/ubuntu-gitpod`
    open, which contains code downloaded from
    <https://github.com/cits3007/ubuntu-gitpod>. However, you can easily
    create and open new folders if desired.


<!-- vim: syntax=markdown tw=72 smartindent :
-->
