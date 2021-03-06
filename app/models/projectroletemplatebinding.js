import Resource from 'ember-api-store/models/resource';
import { reference } from 'ember-api-store/utils/denormalize';
import { get, computed } from '@ember/object';
import C from 'ui/utils/constants';
import PrincipalReference from 'ui/mixins/principal-reference';

export default Resource.extend(PrincipalReference, {
  type: 'projectRoleTemplateBinding',
  project: reference('projectId'),
  roleTemplate: reference('roleTemplateId'),
  user: reference('userId', 'user'),
  displayName: computed('name','id', function() {
    let name = get(this, 'name');
    if ( name ) {
      return name;
    }

    return '(' + get(this,'id') + ')';
  }),
  isCustom: computed('roleTemplateId', function() {
    return !C.BASIC_ROLE_TEMPLATE_ROLES.includes(get(this, 'roleTemplateId'));
  }),

  principalId: computed('userPrincipalId','groupPrincipalId', function() {
    return get(this, 'groupPrincipalId') || get(this, 'userPrincipalId') || null;
  }),

  availableActions: computed('links.remove','name', function() {
    const l = get(this, 'links');
    const canRemove = !!l.remove && get(this,'name') !== 'creator';

    return [
      { label: 'action.remove',     icon: 'icon icon-trash',        action: 'promptDelete', enabled: canRemove, altAction: 'delete', bulkable: true },
      { divider: true },
      { label: 'action.viewInApi',  icon: 'icon icon-external-link',action: 'goToApi',      enabled: true },
    ];
  }),
});
