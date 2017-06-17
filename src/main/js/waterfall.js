var waterfall = {
  scaleBase: 1,
  scaleStep: 2,
  wrapClass: 'waterfall-wrap',
  commonItemClass: 'waterfall__common-item',
  resourceTimingList: null,
  timing: null,
  $el: null,

  init: function ( resourceTimingList, timing, options = {} ) {
    this.resourceTimingList = resourceTimingList;
    this.timing = timing;
    this.$el = document.querySelector('.' + this.wrapClass);

    for (let param in options) {
      if ( this[param] !== undefined ) {
        this[param] = options[param];
      }
    }
  },

  render: function () {
    this._createElement();
    this._renderResourceList();
    this._renderTimingList();
    this._bindEvent();
  },

  _createElement: function () {
    const createElement =  this._tools.createElement;
    const $larger = createElement('a', {className: 'waterfall__btn', innerHTML: '+'});
    const $smaller = createElement('a', {className: 'waterfall__btn', innerHTML: '-'});
    const $tips = createElement('div', {className: 'waterfall__tips'}),
        $btns = createElement('div',   {className: 'waterfall__btns', child: [$larger, $smaller]}),
        $tools = createElement('div',  {className: 'waterfall__tools', child: [$tips, $btns]}),
        $left = createElement('div',   {className: 'waterfall__reource-list'}),
        $wrap = createElement('div',   {className: 'waterfall__timing-wrap'})
        $right = createElement('div',  {className: 'waterfall__timing-list', child: [$wrap]}),
        $content = createElement('div',{className: 'waterfall__content', child: [$left, $right]});
    this.$el.appendChild( $tools );
    this.$el.appendChild( $content );
    this.$tools = $tools;
    this.$content = $content;
  },

  _renderResourceList: function () {
    var $container = document.querySelector('.waterfall__reource-list', this.$content);
    var html = '<p class="' + this.commonItemClass + ' waterfall__reource-item">' + location.origin + '</p>';
    this.resourceTimingList.forEach(( item, index ) => {
      html += '<p class="' + this.commonItemClass + ' waterfall__reource-item">'
           + this._resourceNameFilter( item.name ) + '</p>'
    });
    $container.innerHTML = html;
  },

  _renderTimingList: function () {
    const $container = document.querySelector('.waterfall__timing-wrap', this.$content);
    let child,
        nowWidth,
        topHtml = '',
        tempDiv = this._tools.createElement('div'),
        html = '<p class="waterfall__timing-item ' + this.commonItemClass + '"></p>';
    $container.innerHTML = '';
    tempDiv.innerHTML = html;
    $container.appendChild(tempDiv.childNodes[0]);

    this.resourceTimingList.forEach(( item, index ) => {
      let sslCon = item.secureConnectionStart;
      let dns = item.domainLookupEnd - item.domainLookupStart;
      let tcp = item.connectEnd - item.connectStart;
      let ssl = sslCon ? item.connectEnd - sslCon : sslCon;
      let queue = item.requestStart - item.connectEnd;
      let request = item.responseStart - item.requestStart;
      let response = item.responseEnd - item.responseStart;
      let lookup = item.responseEnd - item.fetchStart;
      let startTime = item.startTime;
      let filter = this._numberToCssPxFilter.bind(this);
      topHtml += '<span class="waterfall__timing-cell" style="width:' + 200 * this.scaleBase + 'px">' + 200 * index + 'ms</span>';
      html = '<p class="waterfall__timing-item ' + this.commonItemClass + '">'
           + '<span class="waterfall__timing-span waterfall__timing-span--dns" style="margin-left:' + filter(startTime) + ';width:' + filter(dns) + '"></span>'
           + '<span class="waterfall__timing-span waterfall__timing-span--tcp" style="width:' + filter(tcp) + '"></span>'
           + '<span class="waterfall__timing-span waterfall__timing-span--ssl" style="width:' + filter(ssl) + '"></span>'
           + '<span class="waterfall__timing-span waterfall__timing-span--queue" style="width:' + filter(queue) + '"></span>'
           + '<span class="waterfall__timing-span waterfall__timing-span--request" style="width:' + filter(request) + '"></span>'
           + '<span class="waterfall__timing-span waterfall__timing-span--response" style="width:' + filter(response) + '"></span>'
           + '</p>';
      tempDiv.innerHTML = html;
      $container.appendChild(tempDiv.childNodes[0]);
    });
    // $container.innerHTML = html.replace(/\{\{topHtml\}\}/g, topHtml);
  },

  _bindEvent: function () {
    const $btn = document.querySelectorAll('.waterfall__btn', this.$tools);
    $btn.forEach(btn => {
      btn.addEventListener('click', e => {
        const target = e.target;
        const action = target.innerHTML;
        e.preventDefault();
        if ( action === '+' && this.scaleBase !== 1 ) {
          this.scaleBase -= this.scaleStep;
        } else if ( action === '-' ) {
          this.scaleBase += this.scaleStep;
        }
        this._renderTimingList();
      }, false);
    });
    this.$content.addEventListener('click', e => {
      console.log( e );
    });
  },

  _resourceNameFilter: function ( name ) {
    const length = name.length;
    const num = 16;
    return name.substr(0, num) + '...' + name.substr(length - num, length);
  },

  _numberToCssPxFilter: function ( num ) {
    return Math.round( num ) / this.scaleBase + 'px';
  },

  _tools: {
    createElement: function (tag, props = {}) {
      var tag = document.createElement( tag );
      for (var prop in props) {
        if ( prop === 'child' && prop.length > 0 ) {
          props[prop].forEach(child => tag.appendChild( child ));
        } else {
          tag[ prop ] = props[prop];
        }
      }
      return tag;
    }
  }
}
