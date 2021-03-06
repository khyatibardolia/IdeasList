import * as React from "react";
import {TextField} from '@material-ui/core';

type Props = {
    onChange: (e: any) => void
    id: string
    label: string
    placeholder: string
    type: string
    name: string
    showError: boolean
    input: any
    meta: {touched: any, error: any}
}
export const RenderTextField: React.FC<Props> = (props: any) => {
    const {input, label, meta: {touched, error}, ...custom} = props;
    return <TextField hintText={label}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        floatingLabelText={label}
                        errorText={touched && error}
                        {...input}
                        {...custom}
                        error={Boolean(touched && error)}
                        helperText={touched ? error : ''}/>

};
