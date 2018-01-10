import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    
    plot_names: function() {
        return this.get('model.plots').map(p => p.get('title'));    
    }.property('model'),
    
    scene_types: function() { 
        return this.get('model.scene_types').map(p => p.get('name'));
    }.property('model'),
    
    actions: {
        plot_changed(new_plot) {
            this.set('model.scene.plot', new_plot);
        },
        type_changed(new_type) {
            this.set('model.scene.scene_type', new_type);
        },
        participants_changed(new_participants) {
            this.set('model.scene.participants', new_participants);
        },
        related_changed(new_related) {
            this.set('model.scene.related_scenes', new_related)
        },
        save() {
            let aj = this.get('ajax');
            let tags = this.get('model.scene.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            aj.queryOne('createScene', { 
               title: this.get('model.scene.title'), 
               icdate: this.get('model.scene.icdate'),
               scene_type: this.get('model.scene.scene_type'),
               location: this.get('model.scene.location'),
               summary: this.get('model.scene.summary'),
               plot_id: this.get('model.scene.plot.id'),
               participants: (this.get('model.scene.participants') || []).map(p => p.name),
               related_scenes: (this.get('model.scene.related_scenes') || []).map(s => s.id),
               tags: tags,
               log: this.get('model.scene.log')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('scenes.scene',                          
                          response.id);
                this.get('flashMessages').success('Scene updated!');
            })
            .catch((response) => {
                this.get('flashMessages').danger(response);
            });
        }
    }
});