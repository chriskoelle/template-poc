class KeytarTemplate extends HTMLElement {
  constructor() {
    super();
  }

  linkClicked(e) {
    e.preventDefault();
    const {
      href
    } = e.currentTarget
    console.log('click from the shadows', e)
    const data = {
      target: e.target,
      currentTarget: e.currentTarget,
      href,
    };
    window.dispatchEvent(new CustomEvent('keytar-click', {
      bubbles: false,
      detail: {
        data
      }
    }));
  }

  toggleSignInLinks() {
    if (window.HRST.mylo) {
      container.classList.add('user-authorized');
    }
  }

  toggleCollapse(collapse) {
    this.container.classList.toggle('collapsed', collapse)
    this.container.classList.toggle('expanded', !collapse)
  }

  setHeight(h) {
    setTimeout(() => {
      this.container.style.maxHeight = h + 'px';
    }, 5)
  }

  collapseContent() {
    toggleCollapse(true)
    setHeight(this.collapsed.offsetHeight)
  }
  expandContent() {
    toggleCollapse(false)
    setHeight(this.expanded.offsetHeight)
  }

  renderContent(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    const template = doc.getElementById('keytar-template')
    this.shadow.appendChild(template.content.cloneNode(true))
    this.attachEventListeners()
  }

  connectedCallback() {
    this.shadow = this.attachShadow({
      mode: 'open'
    })
    fetch('https://mighty-waters-23092.herokuapp.com/template/meter-1')
      .then(res => res.text())
      .then(this.renderContent.bind(this))
  }

  attachEventListeners() {
    this.container = this.querySelector('.template-outer-wrapper');
    this.collapsed = this.querySelector('.collapsed-section')
    this.expanded = this.querySelector('.expanded-section')

    this.querySelector('#collapse-btn').addEventListener('click', this.collapseContent.bind(this))
    this.querySelector('#expand-btn').addEventListener('click', this.expandContent.bind(this))
    this.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', this.linkClicked.bind(this))
    })
  }
}
customElements.define('keytar-template', KeytarTemplate);
