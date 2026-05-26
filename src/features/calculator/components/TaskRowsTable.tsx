import type { TaskRowWithAmount } from '../types';
import AddIcon from '@/icons/add.svg?react';
import CopyIcon from '@/icons/copy.svg?react';
import TrashIcon from '@/icons/trash.svg?react';
import { Button, Card, Input, SelectInput } from '@/shared/ui';
import { formatMoney } from '../utils/formatters';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

type TaskRowsTableProps = {
    rows: TaskRowWithAmount[];
};

export const TaskRowsTable = ({ rows }: TaskRowsTableProps) => {
    const referenceData = useCalculatorStore((state) => {
        return state.referenceData;
    });
    const addTaskRow = useCalculatorStore((state) => {
        return state.addTaskRow;
    });
    const duplicateTaskRow = useCalculatorStore((state) => {
        return state.duplicateTaskRow;
    });
    const deleteTaskRow = useCalculatorStore((state) => {
        return state.deleteTaskRow;
    });
    const clearTaskRows = useCalculatorStore((state) => {
        return state.clearTaskRows;
    });
    const updateTaskRow = useCalculatorStore((state) => {
        return state.updateTaskRow;
    });
    const isAtLimit = rows.length >= 100;

    return (
        <Card title="Призначення етапів / ролей">
            <div className={s.inlineActions}>
                <Button disabled={isAtLimit} onClick={addTaskRow}>
                    <AddIcon />
                    Додати рядок
                </Button>
                <Button variant="danger" onClick={clearTaskRows}>
                    <TrashIcon />
                    Очистити всі рядки
                </Button>
            </div>
            <div className={s.tableWrap}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>ЕТАП/РОЛЬ</th>
                            <th>Коментар</th>
                            <th>Виконавець</th>
                            <th>Підрозділ</th>
                            <th>Сума за період</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            return (
                                <tr key={row.id}>
                                    <td>
                                        <SelectInput
                                            options={referenceData.stageRoles}
                                            placeholder="Не обрано"
                                            value={row.stageRole}
                                            onChange={(value) => {
                                                return updateTaskRow(row.id, 'stageRole', value);
                                            }}
                                        />
                                        {row.stageRole && !referenceData.stageRoles.includes(row.stageRole) ? (
                                            <div className={s.referenceWarning}>Роль відсутня у довіднику</div>
                                        ) : null}
                                    </td>
                                    <td>
                                        <Input
                                            value={row.comment}
                                            onChange={(event) => {
                                                return updateTaskRow(row.id, 'comment', event.target.value);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            value={row.performer}
                                            onChange={(event) => {
                                                return updateTaskRow(row.id, 'performer', event.target.value);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <SelectInput
                                            options={referenceData.departments}
                                            placeholder="Не обрано"
                                            value={row.department}
                                            onChange={(value) => {
                                                return updateTaskRow(row.id, 'department', value);
                                            }}
                                        />
                                        {row.department && !referenceData.departments.includes(row.department) ? (
                                            <div className={s.referenceWarning}>Підрозділ відсутній у довіднику</div>
                                        ) : null}
                                    </td>
                                    <td>
                                        <div className={s.readonlyCell}>
                                            {row.calculatedAmount === null ? (
                                                <span className={s.blankCell}>—</span>
                                            ) : (
                                                formatMoney(row.calculatedAmount)
                                            )}
                                        </div>
                                    </td>
                                    <td className={s.actionsCell}>
                                        <div className={s.inlineActions}>
                                            <Button
                                                disabled={isAtLimit}
                                                variant="secondary"
                                                onClick={() => {
                                                    return duplicateTaskRow(row.id);
                                                }}
                                            >
                                                <CopyIcon />
                                                Дублювати
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    return deleteTaskRow(row.id);
                                                }}
                                            >
                                                <TrashIcon />
                                                Видалити
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className={s.blankCell}>Немає рядків для розрахунку</div>
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
