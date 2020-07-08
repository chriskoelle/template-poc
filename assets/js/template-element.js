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
  /**
   * Get the data-template-id attribute value
   */
  getTemplateId() {
    return this.getAttribute('data-template-id')
  }

  /**
   * Hide the sign in links if the user is signed in
   */
  toggleSignInLinks() {
    if (window.HRST.mylo) {
      this.container.classList.add('user-authorized');
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
    this.toggleCollapse(true)
    this.setHeight(this.collapsed.offsetHeight)
  }
  expandContent() {
    this.toggleCollapse(false)
    this.setHeight(this.expanded.offsetHeight)
  }

  /**
   * Render the HTML content returned by AJAX
   */
  renderContent(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    const template = doc.getElementById('keytar-template')
    this.shadow.appendChild(template.content.cloneNode(true))


    this.attachEventListeners()
  }

  /**
   * Fetch the template content
   * called when a keytar-template element is added to the page
   */
  connectedCallback() {
    this.shadow = this.attachShadow({
      mode: 'open'
    })
    const templateId = this.getTemplateId()
    const templateUrl = `https://mighty-waters-23092.herokuapp.com/template/${templateId}`
    fetch(templateUrl)
      .then(res => res.text())
      .then(this.renderContent.bind(this))
  }

  attachEventListeners() {
    this.container = this.shadow.querySelector('.template-outer-wrapper');
    this.collapsed = this.shadow.querySelector('.collapsed-section')
    this.expanded = this.shadow.querySelector('.expanded-section')

    setTimeout(() => this.setHeight(this.expanded.offsetHeight), 100);

    this.shadow.querySelector('#collapse-btn').addEventListener('click', this.collapseContent.bind(this))
    this.shadow.querySelector('#expand-btn').addEventListener('click', this.expandContent.bind(this))
    this.shadow.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', this.linkClicked.bind(this))
    })
  }
}
customElements.define('keytar-template', KeytarTemplate);
