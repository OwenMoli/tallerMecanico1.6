import { h, type ConcreteComponent } from 'vue'
import type { Row } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { ProductCategory } from '~/types'
import type { Column } from '@tanstack/vue-table'

// type IResolveComponent = ConcreteComponent
// import { UButton, UBadge, UDropdownMenu, UCheckbox } from '#components'

export interface UseProductCategoriesParams {
  UButton: ConcreteComponent | string
  UBadge: ConcreteComponent | string
  UDropdownMenu: ConcreteComponent | string
  UCheckbox: ConcreteComponent | string
}

export function useProductCategories({
  UButton,
  UBadge,
  UDropdownMenu,
  UCheckbox
}: UseProductCategoriesParams) {
  const toast = useToast()

  function getRowItems(row: Row<ProductCategory>) {
    return [
      {
        type: 'label',
        label: 'Actions'
      },
      {
        label: 'Copy category',
        icon: 'i-lucide-copy',
        onSelect() {
          navigator.clipboard.writeText(row.original.id.toString())
          toast.add({
            title: 'Copied to clipboard',
            description: 'Category copied to clipboard'
          })
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Edit category',
        icon: 'i-lucide-edit',
        onSelect() {
          toast.add({
            title: 'Edit category',
            description: 'This would open the edit modal.'
          })
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Delete category',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect() {
          toast.add({
            title: 'Category deleted',
            description: 'The category has been deleted.'
          })
        }
      }
    ]
  }

  function getHeader(
    column: Column<ProductCategory>,
    label: string,
    position: 'left' | 'right'
  ) {
    const isPinned = column.getIsPinned()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label,
      icon: isPinned ? 'i-lucide-pin-off' : 'i-lucide-pin',
      class: '-mx-2.5',
      onClick() {
        column.pin(isPinned === position ? false : position)
      }
    })
  }

  const columns: TableColumn<ProductCategory>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: 'Select all'
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            row.toggleSelected(!!value),
          ariaLabel: 'Select row'
        })
    },
    {
      accessorKey: 'uuid',
      header: 'UUID'
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Description',
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      }
    },
    {
      accessorKey: 'order',
      header: ({ column }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Order',
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        const isSorted = column.getIsSorted()

        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Status',
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
      },
      cell: ({ row }) => {
        const color = {
          visible: 'success' as const,
          hidden: 'error' as const
        }[row.original.status]

        return h(
          UBadge,
          { class: 'capitalize', variant: 'subtle', color },
          () => row.original.status
        )
      }
    },
    {
      id: 'actions',
      header: ({ column }) =>
        h(
          'div',
          { class: 'text-right' },
          getHeader(column, 'Actions', 'right')
        ),

      cell: ({ row }) => {
        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu,
            {
              content: {
                align: 'end'
              },
              items: getRowItems(row)
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto'
              })
          )
        )
      }
      // meta: {
      //   class: {
      //     td: 'md:w-24 lg:w-30 2xl:w-40 whitespace-normal'
      //   }
      // }
    }
  ]

  const columnPinning = ref({ left: [], right: ['actions'] })

  return {
    columns,
    columnPinning
  }
}
