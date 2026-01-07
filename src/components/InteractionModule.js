/**
 * InteractionModule Component
 * Contains a text field and a button.
 */
export function InteractionModule(state, onAction) {
    const container = document.createElement('div');
    container.setAttribute('data-component', 'interaction-module');
    
    container.innerHTML = `
        <input type="text" data-ref="display" readonly value="${state.text || ''}" />
        <button data-ref="trigger">Hold Me</button>
    `;

    const input = container.querySelector('[data-ref="display"]');
    const button = container.querySelector('[data-ref="trigger"]');

    // Event Bindings (React-like event handling)
    button.addEventListener('mousedown', () => onAction({ text: 'Click!' }));
    button.addEventListener('mouseup', () => onAction({ text: '' }));
    // Accessibility: handle keyboard
    button.addEventListener('mouseleave', () => onAction({ text: '' }));

    // Method to update DOM without a full re-render (optimization)
    const update = (newState) => {
        if (input.value !== newState.text) {
            input.value = newState.text;
        }
    };

    return { element: container, update };
}
