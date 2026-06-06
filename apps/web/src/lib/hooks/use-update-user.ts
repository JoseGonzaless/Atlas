import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import type { UpdateUserInput } from '@/lib/db/user'
import { queryKeys } from './query-keys'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => db.updateUser(id, data),
    onSuccess: (_user, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(vars.id) })
    },
  })
}
