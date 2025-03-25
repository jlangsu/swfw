
/*
 *
 * a radix trie  compresses the edge nodes
 *
 * e.g. if there are words 'apple' and 'app' in the trie, the trie could look like
 * {
 *   app: {
 *     __term: true,
 *     le: {
 *       t: {
 *         __term: true,
 *       },
 *       __term: true,
 *     }
 *   }
 * }
 *
 * main advantage is shorter traversal and smaller memory footprint
 *
 */
type Address = string & { '_term': never };

type TrieNode = {
  [address: Address]: TrieNode | null,
  _term?: boolean,
};

export default class Trie {
  head: TrieNode = {};
  
  splitNode(key: string, node: TrieNode, word: string) {
    let keys = Object.keys(node);

    if (keys.length < 1 || key === word) return;

    node[word] = { _term: true };
    const ext = key.slice(word.length,);
    for (const k of keys) {
      node[word][ext] = node[k];
    }
    
    delete node[key];
  }

  getLongestSharedKey(word: string, node: TrieNode): string | undefined {
    let ref = word[0];
    const keys = Object.keys(node);

    if (keys.length === 0) return;
    
    for (let key of keys) {
      if (key === '_term') continue;

      if (key.startsWith(ref)) {
        for (let i = 1; i < key.length; i++) {
          if (!key.startsWith(ref + word[i])) break; 
          ref += word[i];
        }
        this.splitNode(key, node, ref);
        return ref;
      }
    }
  }

  insert(word: string, node: TrieNode = this.head): void {
    const ref = this.getLongestSharedKey(word, node);

    if (!word) return;
    
    if (!ref) {
      node[word] = {
        _term: true
      };
    } else {
      return this.insert(word.slice(ref.length,), node[ref]);
    }
  }

  search(word: string): boolean {

    return false;
  }

  startsWith(word: string): boolean {
    return false;
  }
}

function main() {
  console.log(performance.now() * 1000);
  const trie = new Trie();
  for (let i = 0; i < 1e3; i++) {
    trie.insert('hell' + i);
  }
  console.log(performance.now()* 1000);
  console.log(JSON.stringify(trie));
}

main();

