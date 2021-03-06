import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { next } from '@ember/runloop'
import { get, set, computed } from '@ember/object';
import { NEW_VOLUME, NEW_PVC } from '../form-volumes/component';

export default Component.extend({
  layout,
  modalService: service('modal'),

  tagName: '',

  pvcs: null,
  pvcChoices: computed('pvcs.@each.{name,state}', function() {
    return get(this, 'pvcs').map((v) => {
      let label = get(v, 'displayName');
      const state = get(v, 'state');
      const disabled = false;

      if ( disabled ) {
        label += ' (' + state + ')';
      }

      return {
        label,
        disabled,
        value: get(v, 'id'),
      }
    }).sortBy('label');
  }),

  init() {
    this._super(...arguments);
    set(this, 'pvcs', get(this, 'store').all('persistentVolumeClaim'));
  },

  actions: {
    defineNewVolume() {
      get(this,'modalService').toggleModal('modal-new-volume', {
        model: get(this,'model.volume'),
        callback: (volume) => {
          set(this,'model.volume', volume);
        },
      });
    },

    defineNewPvc() {
      get(this,'modalService').toggleModal('modal-new-pvc', {
        model: get(this,'model.pvc'),
        namespace: get(this, 'namespace'),
        callback: (pvc) => {
          set(this,'model.pvc', pvc);
          if ( !get(this, 'model.volume.name') ) {
            set(this, 'model.volume.name', get(pvc, 'name'));
          }
        },
      });
    },

    remove() {
      this.sendAction('remove');
    },

    addMount() {
      const mount = get(this,'store').createRecord({
        type: 'volumeMount',
      })

      get(this, 'model.mounts').pushObject(mount);
    },

    removeMount(mount) {
      get(this, 'model.mounts').removeObject(mount);
    },
  },

  didReceiveAttrs() {
    const mode = get(this, 'model.mode');

    if ( mode === NEW_VOLUME ) {
      next(() => {
        this.send('defineNewVolume');
      });
    }  else if ( mode  ===  NEW_PVC ) {
      next(() => {
        this.send('defineNewPvc');
      });
    }
  },

});
