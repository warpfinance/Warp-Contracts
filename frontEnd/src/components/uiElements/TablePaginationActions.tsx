import * as React from "react";

import { Grid, IconButton, makeStyles, useTheme } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

interface Props {
    count: number,
    onChangePage: Function,
    page: number,
    rowsPerPage: number,
};

const useStyles = makeStyles((theme) => ({
    paginationActions: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

export const TablePaginationActions: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event: any) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: any) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: any) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: any) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.paginationActions}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}
