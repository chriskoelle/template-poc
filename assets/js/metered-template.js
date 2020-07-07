(function () {
    const shadowRoot = document.querySelector('#keytar-container').shadowRoot;
    const container = shadowRoot.querySelector('.template-outer-wrapper');
    const collapsed = shadowRoot.querySelector('.collapsed-section')
    const expanded = shadowRoot.querySelector('.expanded-section')

    const linkClicked = e => {
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
    shadowRoot.querySelectorAll('a').forEach(el => {
        el.addEventListener('click', linkClicked)
    })

    const toggleCollapse = collapse => {
        container.classList.toggle('collapsed', collapse)
        container.classList.toggle('expanded', !collapse)
    }

    const setHeight = h => {
        setTimeout(() => {
            container.style.maxHeight = h + 'px';
        }, 5)
    }

    const collapseContent = () => {
        toggleCollapse(true)
        setHeight(collapsed.offsetHeight)
    }
    const expandContent = () => {
        toggleCollapse(false)
        setHeight(expanded.offsetHeight)
    }

    shadowRoot.querySelector('#collapse-btn').addEventListener('click', collapseContent)
    shadowRoot.querySelector('#expand-btn').addEventListener('click', expandContent)

    setHeight(expanded.offsetHeight);
    if (window.HRST.mylo) {
        container.classList.add('user-authorized');
    }

    document.addEventListener('mylo-check-access-success', () => {
        console.log('Mylo check access success event listener from the shadow DOM');
        if (window.HRST.mylo) {
            container.classList.add('user-authorized');
        }
    })

})();
