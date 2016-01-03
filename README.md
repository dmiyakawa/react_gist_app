# これは何？

React (+ Flux) + ES6 (というかBabel) + Browserify + Gulp + Ajax (jQuery) なアプリ例。
https://api.github.com/users/dmiyakawa/gists
の1件目のエントリを非同期で取得してHTMLに書き込む。

jQueryはDOM操作ではなく単に$.get()のためだけに使う。
Reactを全面的に使っているのだからDOM操作は必要が無い。

あくまで練習のために作っているので内容に誤りや不適切な点が混じっていても
致命的でなければスルーしていたりするので、注意。

# 参考

Qiitaに書いた: http://qiita.com/amedama/items/e364c164c35742116148

https://facebook.github.io/flux/ の例として挙げられている
https://facebook.github.io/flux/docs/todo-list.html
を参考にした。
ただし実装にあたってはES6を試すという目標もあったので
独自にAction層やStore層についてはそれに併せてES6のClassを全面的に使った。

また、本家では js/ にソースとなるJSコードを含めているが、
これは個人的に分かりづらいと思ったので src/ とした。
Web-Starter-Kitのコードも一部参考にしているが、
全要素の理解は学習時間的にはかなり厳しかったので、
せいぜい gulp serve 等を真似した程度。

https://github.com/google/web-starter-kit/


# 駄文

Fluxと組み合わせた場合、React層はsetState()を軸にした
レンダリングに特化して(this.stateというメンバの名称に反して)、固有の状態を持たない。
状態と状態変化に応じたロジック(今回で言えばAjax処理)はStore層に含まれており、
React層はそのStore層の持つ状態に対応した仮想DOMを生成するのに徹する。
React層には内部で一時的に保持する値がなく、
言い換えれば純粋な関数のような振る舞いをするように見える。
実際にはReact自身が仮想DOMと実際のDOMの差分を検出してHTMLを書き換えるのだが、
React層を実装する際に既存のHTMLのDOM構造を無視できるのは大きい。

従来の方法だとどうしてもWebページの状態を持つ部分とそれを提示する部分の両方で
二重管理するデータが存在するのが個人的にはどうにも気になった。
例えばユーザがある機能をオンにしているという状態と、
画面上のチェックボックスがオンになっている状態に主従を自分で決める必要があったり、
描画フレームワークの都合で前者を主にしたいのに後者を主にせざるを得ないような状況が発生した。

ReactをFluxの流儀で使った場合、React層以降のDOM操作をReactが隠蔽することで、
この二重管理がなくなる。
状態はStoreが全て責任を持ち、その状態を純粋関数的なReact層に流し込んで
仮想DOMを生成するという1方向の性質が強制される。

テストの方針もこれなら単純だろうと思う。
特にReact層は「仮想DOM = React(state)」という副作用のない関数を
テストするかのようにテストできるはずで、これは非常に直感的だと思う。

ところでReactの使用方法についてはFacebook自身が混乱をきたしていた時期もあったように見えた。

https://facebook.github.io/react/tips/initial-ajax.html

2016-01-03時点では上記の記事ではthis.isMounted()を呼んでいるが、
このメソッドはdeprecatedで、Reactコンポーネントの作成にES6のクラスを使用した場合には
そもそも動作しない。

後にFacebook開発者が上のパターンを紹介したことを棚に上げて「これはアンチパターンだ」
とほざくということまでやっている。

https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html

Fluxを使用した場合、isMounted()のようなチェックは必要がない。
Store層からReactを使用する際にisMounted()でなければそもそもMountしないのであって、
Reactの中でそういう分岐を書く必要がない。
Reactの仮想DOM生成を純粋関数っぽく見ようとすると、
isMounted()はAPIとしてそもそも含まれているべきでない。
依存するべきはStoreからの「引数」であって、
React層の実装で自身の内部状態に基づいた分岐をしてはならないのだと思う。

後者の記事に基づいてPromiseをキャンセル可能とするmakeCancelableを使っているんだが、
Flux流儀ならこれは無用の長物だろうと思う。

なお、Flux流儀にする前のGistApp.react.jsを以下のGistに残した。
これもResetButtonがないものの動作する。
ただし、Flux流儀にした後のクリアさにはかなわないように感じる。

https://gist.github.com/dmiyakawa/a74ca4b6d0bca273bd9c
