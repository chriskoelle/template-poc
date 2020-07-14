/**
 * Template Loader
 *
 */

const jamUrl = 'https://mighty-waters-23092.herokuapp.com';

/**
 * Base JAM Template
 * @extends HTMLElement
 */
class JamTemplate extends HTMLElement {
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
    window.dispatchEvent(new CustomEvent('jam-click', {
      bubbles: false,
      detail: {
        data
      }
    }));
  }

  /**
   * Hide the sign in links if the user is signed in
   */
  toggleSignInLinks() {
    if (window.HRST.mylo) {
      this.container.classList.add('user-authorized');
    }
  }

  /**
   * Render the HTML content returned by AJAX
   */
  renderContent(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    const template = doc.querySelector('template')
    this.shadow.appendChild(template.content.cloneNode(true))

    this.attachEventListeners()
  }

  /**
   * Get the data-template-id attribute value
   */
  getTemplateId() {
    return this.getAttribute('data-template-id')
  }

  /**
   * Fetch the template content
   * called when a jam-template element is added to the page
   */
  connectedCallback() {
    this.shadow = this.attachShadow({
      mode: 'open'
    })
    const templateId = this.getTemplateId()
    const templateUrl = `${jamUrl}/template/${templateId}`
    fetch(templateUrl)
      .then(res => res.text())
      .then(this.renderContent.bind(this))
  }

  attachEventListeners() {
    this.shadow.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', this.linkClicked.bind(this))
    })
  }
}
customElements.define('jam-template', JamTemplate);


/**
 * Metered JAM Template
 * @extends JamTemplate
 */
class JamMeterTemplate extends JamTemplate {

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
  attachEventListeners() {
    super.attachEventListeners();
    this.container = this.shadow.querySelector('.template-outer-wrapper');
    this.collapsed = this.shadow.querySelector('.collapsed-section')
    this.expanded = this.shadow.querySelector('.expanded-section')

    setTimeout(() => this.setHeight(this.expanded.offsetHeight), 100);

    this.shadow.querySelector('#collapse-btn').addEventListener('click', this.collapseContent.bind(this))
    this.shadow.querySelector('#expand-btn').addEventListener('click', this.expandContent.bind(this))
  }
}
customElements.define('jam-meter-template', JamMeterTemplate);


// listen for jam-init event
window.addEventListener('jam-init', e => {
  fetchTemplateId(e.detail)
    .then(parseRulesResponse)
    .then(injectComponent);
})

const parseRulesResponse = (res) => res.json();

/**
 * Make a post request to the rules endpoint to retrieve template details
 */
const fetchTemplateId = params => {
  /**
   * TODO: pull the brand from the init event
   */
  return fetch(jamUrl + '/rules/cosmo', {
    method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify(params)
  });
};

/**
 * Inject custom components for matching templates
 *
 * @param {Object[]} templates Templates from the rules response
 */
const injectComponent = (templates) => {
  /**
   * TODO: add the template type to the rules response
   */
  const templateType = 'jam-meter-template';

  if (templates) {
    templates.forEach(({
      params: {
        templateId,
        targetSelector
      } = {}
    }) => {
      const target = document.querySelector(targetSelector);

      if (target) {
        const tpl = document.createElement(templateType);
        tpl.setAttribute('data-template-id', templateId);
        target.appendChild(tpl);
      }
    });
  }
};
