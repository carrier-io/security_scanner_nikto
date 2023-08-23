const NiktoIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            const {
                config,
                is_default,
                selected_integration: id,
                nikto_parameters,
                // save_intermediates_to,
            } = this
            return {
                config,
                is_default,
                id,
                nikto_parameters,
                // save_intermediates_to,
            }
        },
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('AEM item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertCreateTest.add(e, 'danger-overlay')
            }
        },

        initialState: () => ({
            // toggle: false,
            config: {},
            error: {},

            nikto_parameters: "-nointeractive -ask no",
            // save_intermediates_to: '/data/intermediates/dast',
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>

            <div class="form-group">

                <h9>Nikto parameters</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                        v-model="nikto_parameters"
                        :class="{ 'is-invalid': error.nikto_parameters }">
                <div class="invalid-feedback">[[ error.nikto_parameters ]]</div>


                <!--<h9>Save intermediates to</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                    placeholder=""
                    v-model="save_intermediates_to"
                    :class="{ 'is-invalid': error.save_intermediates_to }">
                <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>-->
            </div>
        </div>
    `
}


register_component('scanner-nikto', NiktoIntegration)
