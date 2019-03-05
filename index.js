/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// Patterns in which enemies will spawn within an area
const SPAWN_PATTERN = {
    RANDOM: 'random',
    EVEN: 'even'
}

/**
 *  aframe-spawnpoint-component
 *
 *  Spawn A-Frame entities from a point.
 */
AFRAME.registerComponent('spawnpoint', {
    multiple: true,
    schema: {
        size: {default: 10, type: 'int'},
        pattern: {default: 'random', type: 'string'},
        origin: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
        radius: {default: 10, type: 'int'},
        enableY: {default: false, type: 'boolean'}
    },
    init: function() {
        // Select a-scene
        const sceneEl = document.querySelector('a-scene');
        // Create a pool
        const pool = `pool__${this.id}`;
        sceneEl.setAttribute(pool, `mixin: ${this.id}; size: ${this.data.size}`);
        // Spawn all entities in pool
        for (let i=0; i<this.data.size; i++) {
            // Get entity from pool
            const spawnEntity = sceneEl.components[pool].requestEntity();
            // Generate a spawn position based on settings
            const spawnPosition = this.spawnPosition(this.data.pattern,
                                                this.data.origin,
                                                this.data.radius,
                                                this.data.enableY);
            sceneEl.appendChild(spawnEntity);
            // Must set attributes after adding to scene
            // Set position
            spawnEntity.setAttribute('position', spawnPosition);
        }
    },

    /**
      *  spawnPosition
      *
      *  Create a position where an entity will spawn
      *
      *  pattern: SPAWN_PATTERN flag
      *  origin: position vec3. Origin of the spawn pattern
      *  radius: number. Radius around the origin
      *  enableY: boolean. Enable random y-axis
      *
      *  Returns a position string where the entity will spawn
      *
      */
    spawnPosition: function(spawnPattern, spawnOrigin, spawnRadius, enableY) {
        // Use object for easier manipulation
        let pos = {x: 0, y: 0, z: 0};
        // Random positioning
        if (spawnPattern === SPAWN_PATTERN.RANDOM) {
            // Random function: Positive or negative direction, within a range, from the origin
            pos.x = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * spawnRadius)
                  + spawnOrigin.x;
            // Enable y-axis
            if (enableY) {
                pos.y = (Math.round(Math.random())=== 1 ? 1 : -1)
                      * (Math.random() * spawnRadius)
                      + spawnOrigin.y;
            }
            pos.z = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * spawnRadius)
                  + spawnOrigin.z;
        // Evenly spaced positioning
        } else if (this.data.spawnPattern === SPAWN_PATTERN.EVEN) {
            // TODO Evenly spaced within a range
        // Handle bad pattern name
        } else {
            console.warn('aframe-spawnpoint-component:', `Invalid spawn pattern "${spawnPattern}"`);
        }
        // Return a spawn position
        const result = `${pos.x} ${pos.y} ${pos.z}`;
        return result;
    }
});
