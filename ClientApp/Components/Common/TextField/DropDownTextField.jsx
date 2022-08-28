import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2
    }
});

const DropDownTextField = ({classes, name, id, options, value, handleChange}) => (
    <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor={id}>{name}</InputLabel>
        <Select
            value={value}
            onChange={handleChange}
            input={<Input name={name} id={id} />}
            autoWidth>
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                options.map(
                    (option, index) => <MenuItem key={index} value={option.value || option}>{option.name || option }</MenuItem>)
            }
        </Select>
    </FormControl>
);

DropDownTextField.muiName = "DropDownTextField";

export default withStyles(styles)(DropDownTextField);