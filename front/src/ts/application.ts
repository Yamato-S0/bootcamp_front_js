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
      div2.dataset.test = "task-title";
      div2.className = "task__title";
      div2.textContent = task.title;
      li.appendChild(div1);
      li.appendChild(div2);
      if (ul) {
        ul.appendChild(li);
      }
    });
    return;
  };
}
