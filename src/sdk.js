class SDK {
    constructor() {
        this.resetFormInstance = () => {
            this.internalForm = window.VGSCollect.create(
                process.env.REACT_APP_ENV_ID,
                'sandbox',
                function (state) {
                }
            );
            this.internalForm.field = this.internalForm.__proto__.field;
            this.internalForm.submit = this.internalForm.__proto__.submit;
            this.internalForm.reset = this.internalForm.__proto__.reset;
        }

        this.resetFormInstance();
    }

    field({
              selector,
              type,
              css = {},
              placeholder,
              successColor,
              errorColor,
              color,
              lineHeight,
              fontSize,
              fontFamily,
              disabled,
              readOnly,
              autoFocus,
              hideValue = true,
          }) {
        const validations = type === 'new_pin' ? ['required'] : [];
        if (type === 'confirm_pin')
            validations.push({
                type: 'compareValue',
                params: {
                    field: 'new_pin',
                    function: 'match',
                },
            });

        // TODO: ???
        // if (type === 'current_pin')
        //     validations.push({
        //         type: 'validCurrentPin',
        //         params: {
        //             field: 'current_pin',
        //         },
        //     });

        const requestParams = {
            type: 'card-security-code',
            validations: validations,
            name: type,
            css,
            placeholder,
            successColor,
            errorColor,
            color,
            lineHeight,
            fontSize,
            fontFamily,
            disabled,
            readOnly,
            autoFocus,
            hideValue,
        };

        return new Promise((resolve, reject) => {
            const newField = this.internalForm.field(selector, requestParams);
            if (newField) {
                resolve(newField);
            } else {
                reject(`Field ${type} not initialized.`);
            }
        });
    }

    submit({
               cardId,
               identity,
               authorization,
               currentPin = undefined,
               newPin,
               successCallback,
               errorCallback,
           }) {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Identity: identity,
                Authorization: authorization,
            },
            data: {
                card_id: cardId,
                new_pin: newPin,
            },
        };

        return new Promise((resolve, reject) => {
            const submitResult = this.internalForm.submit(
                `/api/v0/cards/set_pin`,
                options,
                successCallback,
                errorCallback
            );
            if (submitResult) {
                resolve(submitResult);
                this.resetFormInstance();
            } else {
                reject('Form Submit failed.');
            }
        });
    }
}

module.exports = SDK;
