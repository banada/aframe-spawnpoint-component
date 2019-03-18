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
        enableY: {default: false, type: 'boolean'},
        rate: {default: 0, type: 'int'}
    },
    init: function() {
        // TODO open space in the pool via events
        let activeEntities = 0;
        // Select a-scene
        const sceneEl = document.querySelector('a-scene');
        // Create a pool
        const pool = `pool__${this.id}`;
        sceneEl.setAttribute(pool, `mixin: ${this.id}; size: ${this.data.size}`);
        if (this.data.rate > 0) {
            // Spawn entities on interval
            const spawnInterval = setInterval(() => {
                // Pool full, stop interval
                if (activeEntities === this.data.size) {
                    clearInterval(spawnInterval);
                    return;
                }
                this.spawnEntity(sceneEl,
                            sceneEl.components[pool],
                            this.data.pattern,
                            this.data.origin,
                            this.data.radius,
                            this.data.enableY);
                activeEntities++;
            }, this.data.rate);
        } else {
            // Spawn all entities in pool
            for (let i=0; i<this.data.size; i++) {
                this.spawnEntity(sceneEl,
                            sceneEl.components[pool],
                            this.data.pattern,
                            this.data.origin,
                            this.data.radius,
                            this.data.enableY);
                activeEntities++;
            }
        }
    },
    /**
      *  spawnEntity
      *
      *  Spawn an entity as a child
      *
      *  parentEl: The entity to host the spawned entities
      *  pool: The A-Frame pool for the spawned entity
      *  pattern: SPAWN_PATTERN flag
      *  origin: position vec3. Origin of the spawn pattern
      *  radius: number. Radius around the origin
      *  enableY: boolean. Enable random y-axis
      */
    spawnEntity: function(parentEl, pool, pattern, origin, radius, enableY) {
        // Get entity from pool
        const spawnEntity = pool.requestEntity();
        // Generate a spawn position based on settings
        const spawnPosition = this.spawnPosition(pattern,
                                                 origin,
                                                 radius,
                                                 enableY);
        parentEl.appendChild(spawnEntity);
        // Must set attributes after adding to scene
        // Set position
        spawnEntity.object3D.position.set(spawnPosition.x,
                                          spawnPosition.y,
                                          spawnPosition.z);
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
      *  Returns a vec3 where the entity will spawn
      *
      */
    spawnPosition: function(pattern, origin, radius, enableY) {
        // Use object for easier manipulation
        let pos = {x: 0, y: 0, z: 0};
        // Random positioning
        if (pattern === SPAWN_PATTERN.RANDOM) {
            // Random function: Positive or negative direction, within a range, from the origin
            pos.x = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * radius)
                  + origin.x;
            // Enable y-axis
            if (enableY) {
                pos.y = (Math.round(Math.random())=== 1 ? 1 : -1)
                      * (Math.random() * radius)
                      + origin.y;
            }
            pos.z = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * radius)
                  + origin.z;
        // Evenly spaced positioning
        } else if (this.data.pattern === SPAWN_PATTERN.EVEN) {
            // TODO Evenly spaced within a range
        // Handle bad pattern name
        } else {
            console.warn('aframe-spawnpoint-component:', `Invalid spawn pattern "${pattern}"`);
        }
        // Return a spawn position
        return pos;
    }
});
