import { createStore } from './core/store.js';
import { InteractionModule } from './components/InteractionModule.js';

// 1. Initialize State
const store = createStore({ text: '' });

// 2. Select Root
const appRoot = document.getElementById('app');

// 3. Initialize Component
const interaction = InteractionModule(store.getState(), (update) => {
    store.setState(update);
});

appRoot.appendChild(interaction.element);

// 4. Subscribe to changes (Reactivity)
store.subscribe((newState) => {
    interaction.update(newState);
});
