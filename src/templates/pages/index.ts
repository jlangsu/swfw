import { html } from "@core";

export default function Index(): string {
  return html`
    <p>Page is live</p>
  `;
}

type LoopParams = [
  any[],
  variableName: string,
  content: string,
]

function loop(...args: LoopParams) {
  let ret = html``;
  let i = 0;
  while(i < args[0].length) {
    ret += args[2][i];
    i++;
  }
  return ret;
}



