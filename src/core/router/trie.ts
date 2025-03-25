type Letter<N extends number> = {
  0: string,
  length: N
} & string;

type TrieNode = {
  [l: Letter<1>]: TrieNode | null,
  terminal?: boolean,
};

export default class Trie {
  root: TrieNode = {};
  
  insert(word: string): void {
    let node = this.root;
    for (const letter of word) {
      if (!node[letter]) node[letter] = {};
      node = node[letter];
    }
    node.terminal = true;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const letter of prefix) {
      if (!node[letter]) return false;
      node = node[letter];
    }
    return true;
  }

  search(prefix: string): boolean {
    let node = this.root;
    for (const letter of prefix) {
      if (!node[letter]) return false;
      node = node[letter];
    }
    return !!node.terminal;
  }
}

function main() {
  const trie = new Trie();
  trie.insert('hello');
  trie.insert('hell');
  trie.insert('goodbye');
  trie.insert('god');

  console.log('go', trie.search('go'));
  console.log('go: prefix', trie.startsWith('go'));
  console.log('hell', trie.search('hell'));
  console.log('hello: prefix', trie.startsWith('hello'));
  console.log('test', trie.search('test'));
}

main();

