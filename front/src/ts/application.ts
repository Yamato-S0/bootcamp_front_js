export class Application {
  start = async (): Promise<void> => {
    //fetchなどを使ってAPI側に作ったルーティングにリクエストを送り、タスクを取得する
    const response = await fetch(`${process.env.API_URL}/tasks`);
    const tasks = await response.json();
    //取得したタスクをDOM操作してHTMLに表示する
    const ul = document.querySelector("ul");
    //初期状態の2つのdummy taskを削除
    if (ul) { 
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
    }
    //tasksをidについて昇順にソート
    tasks.sort((a: { id: number }, b: { id: number }) => {
      return a.id - b.id;
    });
    let maxId: number = 0;

    tasks.forEach((task: { id: number; title: any; status: number }) => {
      const li = document.createElement("li");
      if (task.status === 1) {
        li.className = "task task--done";
      } else {
        li.className = "task task--todo";
      }
      const div1 = document.createElement("div");
      div1.className = "task__btn";
      const div2 = document.createElement("div");
      div2.setAttribute("data-test", "task-title");
      div2.className = "task__title";
      div2.textContent = task.title;
      li.appendChild(div1);
      li.appendChild(div2);
      if (ul) {
        ul.appendChild(li);
      }
      maxId = task.id;
    });

    //タスクを追加する処理
    //フォームを送信したタイミングでタスクをDBに保存する
    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = document.querySelector("input");
        if (input) {
          const title = input.value;
          maxId += 1;
          //タスクを追加する処理
          const response = await fetch(`${process.env.API_URL}/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: maxId,
              title: title,
              status: 0,
            }),
          });
          const task = await response.json();

          //タスクをDOM操作してHTMLに表示する
          const li = document.createElement("li");
          li.className = "task task--todo";
          const div1 = document.createElement("div");
          div1.className = "task__btn";
          const div2 = document.createElement("div");
          div2.setAttribute("data-test", "task-title");
          div2.className = "task__title";
          div2.textContent = task.title;
          li.appendChild(div1);
          li.appendChild(div2);
          if (ul) {
            ul.appendChild(li);
          }
          //フォームの中身を空にする
          input.value = "";
        }
      });
    }
    //taskをクリックした時に、タスクのstatusを1に変更する処理
    const taskButtons = document.querySelectorAll(".task__btn");
    taskButtons.forEach((taskButton) => {
      taskButton.addEventListener("click", async () => {
        const taskTitle = taskButton.nextElementSibling?.textContent;
        //タスクのstatusを1に変更する処理
        await fetch(`${process.env.API_URL}/tasks` , {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: taskTitle,
              status: 1,
              }),
              });
        //タスクのstatusを変更した後に、タスクのスタイルを変更する処理
        const taskli = taskButton.parentElement;
        if (taskli) {
          taskli.className = "task task--done";
        }
    });
    });
    return;
  };
}
