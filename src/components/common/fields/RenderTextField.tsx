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
    meta: { touched: any, error: any }
}
export const RenderTextField: React.FC<Props> = (props: any) => {
    const {input, label, meta: {touched, error}, ...custom} = props;
    return <TextField id="outlined-error-helper-text"
                      label={label}
                      variant="outlined"
                      fullWidth
                      {...input}
                      {...custom}
                      className={'my-2'}
                      error={Boolean(touched && error)}
                      helperText={touched ? error : ''}/>

};
