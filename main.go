package main

import (
	"code/datastructures"
	"code/types"
	"fmt"
)

func main() {
	// traverseBFS()
	// testPriorityQ()
	v := monotonicStack([]int{2, 1, 1, 2, 4, 3})
	fmt.Println(v)

}

func monotonicStack(nums []int) []int {

	var stack []int
	var res = make([]int, len(nums))

	idx := len(nums) - 1

	for idx >= 0 {
		for len(stack) > 0 && nums[idx] >= stack[len(stack)-1] {
			stack = stack[:len(stack)-1]
		}

		if len(stack) == 0 {
			res[idx] = -1
		} else {
			res[idx] = stack[len(stack)-1]
		}

		stack = append(stack, nums[idx])
		idx--
	}

	return res
}

func testPriorityQ() {
	// 测试整数最小堆
	intHeap := datastructures.NewMinHeap[int]()
	intHeap.Push(10)
	intHeap.Push(3)
	intHeap.Push(5)
	intHeap.Push(1)
	intHeap.Push(2)

	fmt.Println(intHeap.Pop())
	fmt.Println(intHeap.Pop())
	fmt.Println(intHeap.Pop())
	fmt.Println(intHeap.Pop())
	fmt.Println(intHeap.Pop())
}

func traverseBFS() {
	root := &types.TreeNode{
		Val: 1,
	}
	n1 := &types.TreeNode{
		Val: 2,
	}
	n12 := &types.TreeNode{
		Val: 3,
	}
	n21 := &types.TreeNode{
		Val: 4,
	}
	n22 := &types.TreeNode{
		Val: 5,
	}
	n23 := &types.TreeNode{
		Val: 6,
	}
	n31 := &types.TreeNode{
		Val: 7,
	}

	root.Left = n1
	root.Right = n12
	n1.Left = n21
	n1.Right = n22
	n12.Right = n23
	n23.Right = n31
	q := []*types.TreeNode{root}

	layer := 0
	for len(q) > 0 {
		for i, n := range q {
			q = q[1:]
			deal(layer, i, n)

			if n.Left != nil {
				q = append(q, n.Left)
			}

			if n.Right != nil {
				q = append(q, n.Right)
			}
		}

		layer++
	}
}

func deal(layer, idx int, node *types.TreeNode) {
	fmt.Printf("layer %d, num %d node, value: %d\n", layer, idx, node.Val)
}
